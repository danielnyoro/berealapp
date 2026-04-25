/**
 * SIGNUP SCREEN WITH SUPABASE AUTHENTICATION & PHONE NUMBER
 *
 * This component handles user registration with Supabase including:
 * - Email/password signup
 * - Phone number collection
 * - Automatic profile creation in database
 * - Session management
 * - Loading states and error handling
 */

// React Native core components for UI building
import {
  View,
  Text,
  TextInput,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
// SafeAreaView ensures content doesn't overlap with notches/status bars
import { SafeAreaView } from "react-native-safe-area-context";
// React hooks for state management and side effects
import React, { useState } from "react";
// Image component for displaying logos or illustrations
import { Image } from "react-native";
// Supabase client for authentication and database operations
import { supabase } from "../../lib/supabase/client"; // We'll create this file next

// TypeScript interface for form data validation
interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

// TypeScript interface for validation errors
interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  confirmPassword?: string;
}

export default function SignUpScreen({ navigation }: any) {
  // State management for form inputs using useState hooks
  const [formData, setFormData] = useState<SignUpFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  // State for tracking validation errors
  const [errors, setErrors] = useState<ValidationErrors>({});
  // State for loading indicator during API calls
  const [isLoading, setIsLoading] = useState(false);
  // State to toggle password visibility (security feature)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /**
   * Real-time input handler with validation clearing
   * Updates form data and clears errors for the field being edited
   */
  const handleInputChange = (field: keyof SignUpFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  /**
   * Email validation using regex pattern
   * Ensures email follows standard format: name@domain.com
   */
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Phone number validation
   * Supports international formats with country codes
   * Examples: +1234567890, 123-456-7890, (123) 456-7890, 1234567890
   */
  const validatePhoneNumber = (phoneNumber: string): boolean => {
    // Remove all non-digit characters for validation
    const cleanNumber = phoneNumber.replace(/\D/g, "");

    // Check if phone number has at least 10 digits (US/Canada standard)
    // For international, you might want to adjust this minimum
    if (cleanNumber.length < 10 || cleanNumber.length > 15) {
      return false;
    }

    // Optional: Check for valid phone number patterns
    // This regex allows: +1234567890, 1234567890, 123-456-7890, (123) 456-7890, etc.
    const phoneRegex =
      /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,5}[-\s\.]?[0-9]{1,5}$/;
    return phoneRegex.test(phoneNumber) || cleanNumber.length >= 10;
  };

  /**
   * Format phone number as user types (UX enhancement)
   * Automatically formats as: (XXX) XXX-XXXX for US numbers
   */
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, "");

    // Format based on length
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }
  };

  /**
   * Handle phone number input with formatting
   */
  const handlePhoneChange = (text: string) => {
    // Store the raw number in formData
    const rawNumber = text.replace(/\D/g, "");
    // Format for display
    const formattedNumber = formatPhoneNumber(text);
    setFormData((prev) => ({ ...prev, phoneNumber: rawNumber }));

    // Clear phone error if exists
    if (errors.phoneNumber) {
      setErrors((prev) => ({ ...prev, phoneNumber: undefined }));
    }
  };

  /**
   * Password strength validation (security critical)
   * Requirements:
   * - Minimum 8 characters
   * - At least one uppercase letter
   * - At least one number
   * - At least one special character
   */
  const validatePassword = (
    password: string,
  ): { isValid: boolean; message?: string } => {
    if (password.length < 8) {
      return {
        isValid: false,
        message: "Password must be at least 8 characters",
      };
    }
    if (!/[A-Z]/.test(password)) {
      return {
        isValid: false,
        message: "Password must contain at least one uppercase letter",
      };
    }
    if (!/[0-9]/.test(password)) {
      return {
        isValid: false,
        message: "Password must contain at least one number",
      };
    }
    if (!/[!@#$%^&*]/.test(password)) {
      return {
        isValid: false,
        message:
          "Password must contain at least one special character (!@#$%^&*)",
      };
    }
    return { isValid: true };
  };

  /**
   * Comprehensive form validation before submission
   * Checks all fields and returns boolean indicating if form is valid
   */
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone number validation
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!validatePhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber =
        "Please enter a valid phone number (minimum 10 digits)";
    }

    // Password validation
    const passwordValidation = validatePassword(formData.password);
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.message;
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Creates a user profile in the Supabase 'profiles' table
   * This stores additional user information beyond the auth data
   * Uses the user's ID from the auth session as the foreign key
   */
  const createUserProfile = async (userId: string) => {
    try {
      const { error } = await supabase.from("profiles").insert([
        {
          id: userId, // Links to auth.users table
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone_number: formData.phoneNumber, // Store phone number in profile
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.error("Profile creation error:", error);
        // Don't throw - user is already created, profile is optional
        Alert.alert(
          "Warning",
          "Account created but profile setup failed. You can complete it later.",
        );
      }
    } catch (error) {
      console.error("Profile creation error:", error);
    }
  };

  /**
   * Main submit handler with Supabase authentication
   * 1. Validates form inputs
   * 2. Creates user in Supabase Auth
   * 3. Creates user profile in database
   * 4. Handles navigation and error states
   */
  const handleSubmit = async () => {
    // First validate all inputs
    if (!validateForm()) {
      Alert.alert("Validation Error", "Please check all fields and try again.");
      return;
    }

    // Start loading state to prevent double submission
    setIsLoading(true);

    try {
      // STEP 1: Sign up with Supabase Auth
      // This creates the user in auth.users table and sends email confirmation
      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        {
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              first_name: formData.firstName,
              last_name: formData.lastName,
              phone_number: formData.phoneNumber, // Include phone in user metadata
            },
          },
        },
      );

      if (signUpError) {
        throw signUpError;
      }

      // STEP 2: If user was created successfully, create their profile
      if (authData?.user?.id) {
        await createUserProfile(authData.user.id);
      }

      // STEP 3: Show success message with confirmation requirement
      Alert.alert(
        "Success!",
        "Account created successfully! Please check your email to confirm your account before signing in.",
        [
          {
            text: "OK",
            onPress: () => {
              // Navigate back to sign in screen
              navigation.navigate("SignIn");
            },
          },
        ],
      );

      // Clear form after successful submission
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      // Handle different types of errors
      let errorMessage = "Something went wrong. Please try again.";

      if (error.message.includes("already registered")) {
        errorMessage =
          "This email is already registered. Please sign in instead.";
      } else if (error.message.includes("password")) {
        errorMessage = "Password does not meet security requirements.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("Registration Failed", errorMessage);
      console.error("Signup error:", error);
    } finally {
      // Always turn off loading state
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo/Image Container - Add your app logo here */}
        <View style={styles.imageContainer}>
          <Image
            source={require("../../assets/images/favicon.png")} // Update path to your logo
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Header Section */}
        <Text style={styles.title}>Sign Up Form</Text>
        <Text style={styles.subtitle}>Create Your Account</Text>

        {/* Form Container */}
        <View style={styles.form}>
          {/* First Name Input with Error Display */}
          <View>
            <TextInput
              placeholder="First Name"
              placeholderTextColor="#6e838b"
              keyboardType="default"
              style={[styles.input, errors.firstName && styles.inputError]}
              value={formData.firstName}
              onChangeText={(text) => handleInputChange("firstName", text)}
              editable={!isLoading}
            />
            {errors.firstName && (
              <Text style={styles.errorText}>{errors.firstName}</Text>
            )}
          </View>

          {/* Last Name Input */}
          <View>
            <TextInput
              placeholder="Last Name"
              placeholderTextColor="#6e838b"
              keyboardType="default"
              returnKeyType="next"
              style={[styles.input, errors.lastName && styles.inputError]}
              value={formData.lastName}
              onChangeText={(text) => handleInputChange("lastName", text)}
              editable={!isLoading}
            />
            {errors.lastName && (
              <Text style={styles.errorText}>{errors.lastName}</Text>
            )}
          </View>

          {/* Email Input with Email-specific keyboard */}
          <View>
            <TextInput
              placeholder="Email"
              placeholderTextColor="#6e838b"
              style={[styles.input, errors.email && styles.inputError]}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              inputMode="email"
              value={formData.email}
              onChangeText={(text) =>
                handleInputChange("email", text.toLowerCase())
              }
              editable={!isLoading}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          {/* Phone Number Input with Phone Keyboard */}
          <View>
            <TextInput
              placeholder="Phone Number"
              placeholderTextColor="#6e838b"
              keyboardType="phone-pad"
              style={[styles.input, errors.phoneNumber && styles.inputError]}
              returnKeyType="next"
              value={formatPhoneNumber(formData.phoneNumber)}
              onChangeText={handlePhoneChange}
              editable={!isLoading}
              maxLength={16} // (XXX) XXX-XXXX = 14 characters + country code
            />
            {errors.phoneNumber && (
              <Text style={styles.errorText}>{errors.phoneNumber}</Text>
            )}
            {/* Optional helper text for phone format */}
            <Text style={styles.helperText}>
              Format: (XXX) XXX-XXXX (10 digits required)
            </Text>
          </View>

          {/* Password Input with Secure Text Entry */}
          <View>
            <TextInput
              placeholder="Password"
              placeholderTextColor="#6e838b"
              returnKeyType="next"
              autoCapitalize="none"
              secureTextEntry={!showPassword}
              autoCorrect={false}
              style={[styles.input, errors.password && styles.inputError]}
              value={formData.password}
              onChangeText={(text) => handleInputChange("password", text)}
              editable={!isLoading}
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
            {/* Password requirements helper */}
            <Text style={styles.helperText}>
              Requirements: 8+ chars, uppercase, number, special char (!@#$%^&*)
            </Text>
          </View>

          {/* Confirm Password Input */}
          <View>
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="#6e838b"
              autoCapitalize="none"
              secureTextEntry={!showConfirmPassword}
              autoCorrect={false}
              style={[
                styles.input,
                errors.confirmPassword && styles.inputError,
              ]}
              value={formData.confirmPassword}
              onChangeText={(text) =>
                handleInputChange("confirmPassword", text)
              }
              editable={!isLoading}
            />
            {errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}
          </View>

          {/* Submit Button with Loading State */}
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          {/* Navigation Link to Sign In */}
          <TouchableOpacity
            style={styles.linkbutton}
            onPress={() => navigation.navigate("SignIn")}
            disabled={isLoading}
          >
            <Text style={styles.linkText}>
              Already have an account?{" "}
              <Text style={styles.linkTextButton}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// Styling with theme consistency
const styles = StyleSheet.create({
  imageContainer: {
    alignItems: "center",
    marginTop: 5,
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  container: {
    flex: 1,
    marginTop: 0,
    backgroundColor: "#011636ed", // Dark blue theme
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "200",
    marginBottom: 20,
    textAlign: "left",
    color: "white",
  },
  subtitle: {
    fontSize: 16,
    color: "grey",
    marginBottom: 16,
  },
  form: {
    width: "100%",
    backgroundColor: "#def1eb", // Light teal form background
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
    borderWidth: 0.5,
    borderColor: "rgba(43, 58, 43, 0.93)",
  },
  input: {
    backgroundColor: "#cbe7e7",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    color: "#000000",
    fontWeight: "500",
  },
  inputError: {
    borderColor: "#ff3b30",
    borderWidth: 2,
  },
  errorText: {
    color: "#ff3b30",
    fontSize: 12,
    marginBottom: 4,
    marginLeft: 8,
  },
  helperText: {
    color: "#6e838b",
    fontSize: 11,
    marginBottom: 16,
    marginLeft: 8,
  },
  button: {
    backgroundColor: "black",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    alignItems: "center",
    marginBottom: 16,
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  linkText: {
    fontSize: 16,
    fontWeight: "200",
    color: "#011636",
  },
  linkbutton: {
    alignItems: "center",
    padding: 8,
  },
  linkTextButton: {
    fontWeight: "600",
    color: "rgb(0, 0, 0)",
    fontSize: 18,
  },
});
