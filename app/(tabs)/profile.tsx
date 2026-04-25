// Import necessary libraries and components
import React, { useState, useEffect } from "react"; // React core and hooks for state management
import {
  View, // Container component for layout
  Text, // For displaying text
  StyleSheet, // For creating styles
  TextInput, // For text input fields when editing
  TouchableOpacity, // Makes any component touchable/clickable
  ScrollView, // Enables scrolling for long content
  Alert, // Shows popup alerts to user
  Image, // Displays images (profile picture)
  ActivityIndicator, // Loading spinner
  Platform, // Detects which OS (iOS/Android) is running
  Linking, // Opens external links like settings
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Icon library for UI icons (camera, save, etc.)
import * as ImagePicker from "expo-image-picker"; // Handles camera and gallery access
import { supabase } from "../../lib/supabase/client"; // Supabase client for database operations

// Main Profile component - displays and manages user profile
export default function Profile() {
  // STATE VARIABLES - track changing data in the component

  // loading: Shows spinner while fetching or saving data
  const [loading, setLoading] = useState(false);

  // editing: Toggle between view mode (false) and edit mode (true)
  const [editing, setEditing] = useState(false);

  // Permission states - track if user granted camera/gallery access
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);

  // userId: Stores the current authenticated user's ID from Supabase
  const [userId, setUserId] = useState(null);

  // formData: Object containing all profile information displayed in the form
  const [formData, setFormData] = useState({
    firstName: "", // User's first name
    lastName: "", // User's last name
    email: "", // User's email address
    phoneNumber: "", // User's phone number (optional)
    profilePic: "", // URL of profile picture
  });

  // originalData: Backup copy of data before editing (used for cancel feature)
  const [originalData, setOriginalData] = useState({});

  // EFFECT HOOKS - Run code at specific times

  // useEffect runs when component first loads
  useEffect(() => {
    checkUser(); // Check if user is logged in
    requestPermissions(); // Request camera/gallery permissions
  }, []); // Empty array [] means this runs only ONCE when component mounts

  // FUNCTION: Check if user is authenticated with Supabase
  const checkUser = async () => {
    // Get the currently logged in user from Supabase auth
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // If user exists, store their ID and fetch their profile data
      setUserId(user.id);
      fetchUserData(user.id);
    } else {
      // No user logged in - show error message
      Alert.alert("Error", "Please login first");
    }
  };

  // FUNCTION: Fetch user profile data from Supabase database
  const fetchUserData = async (id) => {
    setLoading(true); // Show loading spinner while fetching
    try {
      // Query the 'profiles' table for user with matching ID
      // Select only the fields we need (first_name, last_name, etc.)
      const { data, error } = await supabase
        .from("profiles") // Table name in Supabase
        .select("first_name, last_name, email, phone_number, profile_pic")
        .eq("id", id) // Where id equals current user's ID
        .single(); // Expect only one record back

      // If error is not "no rows found", throw it
      if (error && error.code !== "PGRST116") throw error;

      // Map database field names to our form field names
      // Database uses snake_case (first_name), form uses camelCase (firstName)
      const fetchedData = {
        firstName: data?.first_name || "", // Use empty string if no data
        lastName: data?.last_name || "",
        email: data?.email || "",
        phoneNumber: data?.phone_number || "",
        profilePic: data?.profile_pic || "",
      };

      // Update state with fetched data
      setFormData(fetchedData);
      setOriginalData(fetchedData); // Save copy for cancel functionality
    } catch (error) {
      // Log error to console for debugging
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false); // Hide loading spinner regardless of success/failure
    }
  };

  // FUNCTION: Request camera and gallery permissions from user
  const requestPermissions = async () => {
    // Only request permissions on mobile devices (not web)
    if (Platform.OS !== "web") {
      // Request permission to use camera
      const cameraPermission =
        await ImagePicker.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");

      // Request permission to access photo gallery
      const galleryPermission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryPermission.status === "granted");
    }
  };

  // FUNCTION: Update form data when user types in input fields
  const handleInputChange = (field, value) => {
    // Use spread operator to keep existing data, only update changed field
    setFormData((prev) => ({
      ...prev,
      [field]: value, // [field] is dynamic property name (e.g., 'firstName')
    }));
  };

  // FUNCTION: Show options for changing profile picture (Camera or Gallery)
  const showImagePickerOptions = () => {
    Alert.alert(
      "Change Profile Picture", // Title of alert
      "Choose an option", // Message
      [
        { text: "Take Photo", onPress: takePhoto }, // Camera option
        { text: "Choose from Gallery", onPress: pickFromGallery }, // Gallery option
        { text: "Cancel", style: "cancel" }, // Cancel button
      ],
    );
  };

  // FUNCTION: Take photo using device camera
  const takePhoto = async () => {
    // Check if camera permission was granted
    if (!hasCameraPermission) {
      Alert.alert("Error", "Camera permission required");
      return;
    }

    try {
      // Launch camera and wait for result
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Only allow images
        allowsEditing: true, // Allow user to crop/edit
        aspect: [1, 1], // Square aspect ratio (1:1)
        quality: 0.8, // 80% quality (reduces file size)
      });

      // If user didn't cancel, upload the image
      if (!result.canceled) {
        await uploadImage(result.assets[0].uri); // Get URI (file path) of taken photo
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo");
    }
  };

  // FUNCTION: Pick image from device gallery
  const pickFromGallery = async () => {
    // Check if gallery permission was granted
    if (!hasGalleryPermission) {
      Alert.alert("Error", "Gallery permission required");
      return;
    }

    try {
      // Open gallery and let user pick an image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      // If user didn't cancel, upload the selected image
      if (!result.canceled) {
        await uploadImage(result.assets[0].uri); // URI of selected image
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  // FUNCTION: Upload image to Supabase Storage
  const uploadImage = async (uri) => {
    setLoading(true); // Show loading spinner
    try {
      // Step 1: Fetch the image from local URI and convert to blob
      // Blob = Binary Large Object (raw image data)
      const response = await fetch(uri);
      const blob = await response.blob();

      // Step 2: Extract file extension from URI (jpg, png, etc.)
      // If no extension found, default to 'jpg'
      const fileExt = uri.split(".").pop() || "jpg";

      // Step 3: Create unique filename using user ID and timestamp
      // Example: "user-123/1634567890123.jpg"
      const fileName = `${userId}/${Date.now()}.${fileExt}`;

      // Step 4: Upload blob to Supabase 'avatars' bucket
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars") // Storage bucket name
        .upload(fileName, blob, {
          // File name and data
          contentType: blob.type || `image/${fileExt}`, // MIME type
          cacheControl: "3600", // Cache for 1 hour
          upsert: true, // Replace file if it already exists
        });

      // If upload failed, throw error
      if (uploadError) throw uploadError;

      // Step 5: Get public URL of uploaded image
      // Supabase generates a URL that anyone can access
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(fileName);

      // Step 6: Update formData with new profile picture URL
      setFormData((prev) => ({ ...prev, profilePic: publicUrl }));

      // Step 7: Notify user of success
      Alert.alert("Success", "Profile picture updated");
    } catch (error) {
      // Log error and show user-friendly message
      console.error("Error uploading image:", error);
      Alert.alert("Error", "Failed to upload image: " + error.message);
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  // FUNCTION: Save profile data to Supabase database
  const saveData = async () => {
    // VALIDATION: Check required fields are filled
    if (!formData.firstName || !formData.lastName || !formData.email) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    // VALIDATION: Check email has @ symbol
    if (!formData.email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email");
      return;
    }

    setLoading(true); // Show loading spinner
    try {
      // Update or insert profile in 'profiles' table
      const { error } = await supabase.from("profiles").upsert({
        // upsert = update if exists, insert if doesn't
        id: userId, // User ID from Supabase auth
        first_name: formData.firstName, // Map camelCase to snake_case
        last_name: formData.lastName,
        email: formData.email,
        phone_number: formData.phoneNumber,
        profile_pic: formData.profilePic,
        updated_at: new Date(), // Timestamp of this update
      });

      // If database error occurred
      if (error) throw error;

      // Success! Notify user and exit edit mode
      Alert.alert("Success", "Profile updated successfully");
      setEditing(false); // Switch back to view mode
      setOriginalData(formData); // Update backup with saved data
    } catch (error) {
      console.error("Error saving data:", error);
      Alert.alert("Error", "Failed to save changes: " + error.message);
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  // FUNCTION: Cancel editing and revert to original data
  const cancelEditing = () => {
    setFormData(originalData); // Restore data from backup
    setEditing(false); // Exit edit mode
  };

  // FUNCTION: Render a form field (text input or display)
  // Parameters:
  // - label: Text shown above field (e.g., "First Name")
  // - field: Which property in formData this field uses (e.g., "firstName")
  // - placeholder: Text shown when input is empty
  // - keyboardType: Type of keyboard to show (email, phone, default)
  // - required: Whether field is required (shows *)
  const renderField = (
    label,
    field,
    placeholder,
    keyboardType = "default",
    required = false,
  ) => (
    <View style={styles.fieldContainer}>
      {/* Field label with optional red asterisk if required */}
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>

      {/* If in edit mode, show TextInput, else show plain text */}
      {editing ? (
        <TextInput
          style={styles.input}
          value={formData[field]}
          onChangeText={(value) => handleInputChange(field, value)}
          placeholder={placeholder}
          keyboardType={keyboardType}
          editable={!loading} // Disable input while loading
        />
      ) : (
        <View style={styles.valueContainer}>
          <Text style={styles.value}>
            {formData[field] || "Not provided"} {/* Show message if empty */}
          </Text>
        </View>
      )}
    </View>
  );

  // LOADING SCREEN: Show spinner while fetching initial data
  if (loading && !formData.firstName) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // MAIN RENDER: Display the profile screen
  return (
    <ScrollView style={styles.container}>
      {/* HEADER SECTION */}
      <View style={styles.header}>
        <Text style={styles.title}>Profile Information</Text>
        <Text style={styles.subtitle}>
          Ensure all information is accurate and consistent with physical
          records
        </Text>
      </View>

      {/* PROFILE PICTURE SECTION */}
      <View style={styles.profilePicSection}>
        {/* Touchable only in edit mode */}
        <TouchableOpacity
          onPress={editing ? showImagePickerOptions : null}
          disabled={!editing}
        >
          {/* Show image if exists, otherwise show placeholder icon */}
          {formData.profilePic ? (
            <Image
              source={{ uri: formData.profilePic }}
              style={styles.profilePic}
            />
          ) : (
            <View style={styles.profilePicPlaceholder}>
              <Ionicons name="person" size={50} color="#ccc" />
            </View>
          )}

          {/* Camera icon overlay - only visible in edit mode */}
          {editing && (
            <View style={styles.editIconOverlay}>
              <Ionicons name="camera" size={20} color="white" />
            </View>
          )}
        </TouchableOpacity>

        {/* Helper text shown only in edit mode */}
        {editing && (
          <Text style={styles.editPhotoText}>
            Tap to change profile picture
          </Text>
        )}
      </View>

      {/* FORM FIELDS SECTION */}
      <View style={styles.form}>
        {renderField(
          "First Name",
          "firstName",
          "Enter first name",
          "default",
          true,
        )}
        {renderField(
          "Last Name",
          "lastName",
          "Enter last name",
          "default",
          true,
        )}
        {renderField(
          "Email Address",
          "email",
          "Enter email address",
          "email-address",
          true,
        )}
        {renderField(
          "Phone Number",
          "phoneNumber",
          "Enter phone number",
          "phone-pad",
          false,
        )}
      </View>

      {/* ACTION BUTTONS SECTION */}
      <View style={styles.buttonContainer}>
        {editing ? (
          // EDIT MODE: Show Save and Cancel buttons
          <>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={saveData}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" /> // Show spinner while saving
              ) : (
                <>
                  <Ionicons name="save" size={20} color="white" />
                  <Text style={styles.buttonText}>Save Changes</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={cancelEditing}
              disabled={loading}
            >
              <Ionicons name="close" size={20} color="white" />
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </>
        ) : (
          // VIEW MODE: Show Edit button
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={() => setEditing(true)}
          >
            <Ionicons name="create" size={20} color="white" />
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

// STYLES - Define how everything looks
const styles = StyleSheet.create({
  // Main container for the screen
  container: {
    flex: 1, // Take all available space
    backgroundColor: "#f5f5f5", // Light gray background
  },

  // Loading spinner container (centered)
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // Header section at top
  header: {
    backgroundColor: "white",
    padding: 20,
    borderBottomWidth: 1, // Light border at bottom
    borderBottomColor: "#e0e0e0",
  },

  // Main title text
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },

  // Subtitle/description text
  subtitle: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },

  // Profile picture section container
  profilePicSection: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
    marginTop: 10,
  },

  // Profile image style (circular)
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60, // Half of width/height = circle
    borderWidth: 3,
    borderColor: "#007AFF",
  },

  // Placeholder when no image exists
  profilePicPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#007AFF",
  },

  // Camera icon overlay on profile picture
  editIconOverlay: {
    position: "absolute", // Position relative to parent
    bottom: 0,
    right: 0,
    backgroundColor: "#007AFF",
    borderRadius: 15,
    padding: 8,
  },

  // Helper text under profile picture
  editPhotoText: {
    marginTop: 10,
    color: "#007AFF",
    fontSize: 12,
  },

  // Form container
  form: {
    backgroundColor: "white",
    marginTop: 10,
    paddingVertical: 10,
  },

  // Container for each form field
  fieldContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  // Field label text
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },

  // Red asterisk for required fields
  required: {
    color: "red",
  },

  // Text input style (edit mode)
  input: {
    fontSize: 16,
    color: "#333",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#007AFF",
  },

  // Container for displaying value (view mode)
  valueContainer: {
    paddingVertical: 8,
  },

  // Value text style (view mode)
  value: {
    fontSize: 16,
    color: "#666",
  },

  // Container for action buttons (side by side)
  buttonContainer: {
    flexDirection: "row", // Arrange buttons horizontally
    padding: 20,
    gap: 10, // Space between buttons
  },

  // Base button style
  button: {
    flex: 1, // Take equal width
    flexDirection: "row", // Icon and text side by side
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    gap: 8,
  },

  // Edit button (blue)
  editButton: {
    backgroundColor: "#007AFF",
  },

  // Save button (green)
  saveButton: {
    backgroundColor: "#34C759",
  },

  // Cancel button (red)
  cancelButton: {
    backgroundColor: "#FF3B30",
  },

  // Button text style
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
