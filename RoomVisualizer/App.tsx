// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.tsx to start working on your app!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

// import React, { useState, useEffect } from 'react';
// import {
//   StyleSheet,
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
//   SafeAreaView,
//   ActivityIndicator,
//   ScrollView,
//   Dimensions,
//   Alert,
// } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { useImageSegmentation, DEEPLAB_V3_RESNET50, DeeplabLabel } from 'react-native-executorch';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';

// const { width: screenWidth } = Dimensions.get('window');

// // Sample material textures - in production, these would come from your database
// const MATERIALS = [
//   { id: 1, name: 'Ceramic White', category: 'wall', color: '#F5F5F5' },
//   { id: 2, name: 'Wood Grain', category: 'floor', color: '#8B4513' },
//   { id: 3, name: 'Marble Gray', category: 'wall', color: '#808080' },
//   { id: 4, name: 'Oak Floor', category: 'floor', color: '#DEB887' },
//   { id: 5, name: 'Brick Red', category: 'wall', color: '#B22222' },
//   { id: 6, name: 'Slate Tile', category: 'floor', color: '#2F4F4F' },
// ];

// export default function App() {
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);
//   const [segmentationMask, setSegmentationMask] = useState<number[] | null>(null);
//   const [selectedMaterial, setSelectedMaterial] = useState<typeof MATERIALS[0] | null>(null);
//   const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
//   const [processedImageUri, setProcessedImageUri] = useState<string | null>(null);
//   const [showMaterials, setShowMaterials] = useState(false);

//   // Initialize the segmentation model
//   const model = useImageSegmentation({
//     modelSource: DEEPLAB_V3_RESNET50,
//   });

//   // Request permissions on mount
//   useEffect(() => {
//     (async () => {
//       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission needed', 'Please grant gallery access to continue');
//       }
//     })();
//   }, []);

//   // Pick image from gallery
//   const pickImage = async () => {
//     try {
//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         quality: 1,
//       });

//       if (!result.canceled && result.assets[0]) {
//         const uri = result.assets[0].uri;
//         setSelectedImage(uri);
//         setProcessedImageUri(null);
//         setSegmentationMask(null);
        
//         // Get image dimensions
//         Image.getSize(uri, (width, height) => {
//           setImageDimensions({ width, height });
//         });
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Failed to pick image');
//     }
//   };

//   // Run segmentation on the selected image
//   const runSegmentation = async () => {
//     if (!selectedImage || !model.isReady) {
//       Alert.alert('Error', !model.isReady ? 'Model is still loading' : 'Please select an image first');
//       return;
//     }

//     try {
//       // Run segmentation focusing on walls and floors
//       const outputDict = await model.forward(
//         selectedImage,
//         [DeeplabLabel.WALL, DeeplabLabel.FLOOR], // classes of interest
//         true // resize to original image dimensions
//       );

//       // Get the ARGMAX array (most probable class for each pixel)
//       const argmaxArray = outputDict[DeeplabLabel.ARGMAX];
//       setSegmentationMask(argmaxArray);
      
//       Alert.alert('Success', 'Room surfaces detected! Now select a material to apply.');
//       setShowMaterials(true);
      
//     } catch (error) {
//       console.error('Segmentation failed:', error);
//       Alert.alert('Error', 'Failed to analyze image');
//     }
//   };

//   // Apply selected material to walls/floors
//   const applyMaterial = async (material: typeof MATERIALS[0]) => {
//     if (!selectedImage || !segmentationMask || !imageDimensions) {
//       Alert.alert('Error', 'No image or segmentation data available');
//       return;
//     }

//     setSelectedMaterial(material);

//     // Create a canvas to apply the texture
//     // This is a simplified visualization - in production, you'd use expo-three for 3D rendering
//     try {
//       // For demo purposes, we'll just create a composite image description
//       // In a real app, you'd use expo-three to create a 3D surface with the texture
      
//       const categoryToModify = material.category === 'wall' ? DeeplabLabel.WALL : DeeplabLabel.FLOOR;
      
//       // Here you would:
//       // 1. Create a 3D plane matching the detected surface
//       // 2. Apply the material texture to it
//       // 3. Composite it with the original image
      
//       // For this demo, we'll simulate success
//       Alert.alert(
//         'Material Applied', 
//         `${material.name} applied to ${material.category}s! In production, this would show a 3D visualization.`
//       );
      
//       // In a real implementation, you would use expo-three to render:
//       // const surface = new THREE.PlaneGeometry(adjustedWidth, adjustedHeight);
//       // const material = new THREE.MeshBasicMaterial({ map: texture });
//       // const mesh = new THREE.Mesh(surface, material);
      
//     } catch (error) {
//       console.error('Failed to apply material:', error);
//       Alert.alert('Error', 'Failed to apply material');
//     }
//   };

//   return (
//     <GestureHandlerRootView style={styles.container}>
//       <SafeAreaView style={styles.safeArea}>
//         <View style={styles.header}>
//           <Text style={styles.headerTitle}>Room Visualizer</Text>
//           <Text style={styles.headerSubtitle}>AI-Powered Design</Text>
//         </View>

//         <ScrollView contentContainerStyle={styles.scrollContent}>
//           {/* Image Display Area */}
//           <View style={styles.imageContainer}>
//             {selectedImage ? (
//               <>
//                 <Image source={{ uri: processedImageUri || selectedImage }} style={styles.image} />
//                 {model.isGenerating && (
//                   <View style={styles.loadingOverlay}>
//                     <ActivityIndicator size="large" color="#4A90E2" />
//                     <Text style={styles.loadingText}>Analyzing room...</Text>
//                   </View>
//                 )}
//               </>
//             ) : (
//               <View style={styles.placeholderImage}>
//                 <Text style={styles.placeholderText}>No image selected</Text>
//               </View>
//             )}
//           </View>

//           {/* Model Loading Status */}
//           {!model.isReady && !model.error && (
//             <View style={styles.statusContainer}>
//               <ActivityIndicator size="small" color="#4A90E2" />
//               <Text style={styles.statusText}>
//                 Loading AI model... {Math.round(model.downloadProgress * 100)}%
//               </Text>
//             </View>
//           )}

//           {/* Error Display */}
//           {model.error && (
//             <View style={styles.errorContainer}>
//               <Text style={styles.errorText}>Error loading model: {model.error}</Text>
//             </View>
//           )}

//           {/* Action Buttons */}
//           <View style={styles.buttonContainer}>
//             <TouchableOpacity style={styles.button} onPress={pickImage}>
//               <Text style={styles.buttonText}>📸 Pick Room Photo</Text>
//             </TouchableOpacity>

//             {selectedImage && (
//               <TouchableOpacity 
//                 style={[styles.button, styles.primaryButton]} 
//                 onPress={runSegmentation}
//                 disabled={!model.isReady || model.isGenerating}
//               >
//                 <Text style={styles.buttonText}>
//                   {model.isGenerating ? 'Analyzing...' : '🔍 Detect Walls & Floors'}
//                 </Text>
//               </TouchableOpacity>
//             )}
//           </View>

//           {/* Materials Selection */}
//           {showMaterials && segmentationMask && (
//             <View style={styles.materialsSection}>
//               <Text style={styles.sectionTitle}>Select Material</Text>
//               <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//                 {MATERIALS.map((material) => (
//                   <TouchableOpacity
//                     key={material.id}
//                     style={[
//                       styles.materialCard,
//                       selectedMaterial?.id === material.id && styles.selectedMaterial,
//                     ]}
//                     onPress={() => applyMaterial(material)}
//                   >
//                     <View 
//                       style={[
//                         styles.materialColor,
//                         { backgroundColor: material.color }
//                       ]} 
//                     />
//                     <Text style={styles.materialName}>{material.name}</Text>
//                     <Text style={styles.materialCategory}>{material.category}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </ScrollView>
//             </View>
//           )}

//           {/* Information Box */}
//           <View style={styles.infoBox}>
//             <Text style={styles.infoTitle}>How it works:</Text>
//             <Text style={styles.infoText}>1. Upload a photo of your room</Text>
//             <Text style={styles.infoText}>2. AI detects walls and floors</Text>
//             <Text style={styles.infoText}>3. Choose materials to visualize</Text>
//             <Text style={styles.infoText}>4. See realistic preview (coming soon with 3D)</Text>
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     </GestureHandlerRootView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5F5F5',
//   },
//   safeArea: {
//     flex: 1,
//   },
//   header: {
//     padding: 20,
//     backgroundColor: '#4A90E2',
//     alignItems: 'center',
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: 'white',
//   },
//   headerSubtitle: {
//     fontSize: 14,
//     color: 'rgba(255,255,255,0.8)',
//     marginTop: 4,
//   },
//   scrollContent: {
//     padding: 16,
//   },
//   imageContainer: {
//     width: screenWidth - 32,
//     height: 300,
//     backgroundColor: '#E0E0E0',
//     borderRadius: 12,
//     overflow: 'hidden',
//     marginBottom: 16,
//     position: 'relative',
//   },
//   image: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'cover',
//   },
//   placeholderImage: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   placeholderText: {
//     color: '#999',
//     fontSize: 16,
//   },
//   loadingOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     color: 'white',
//     marginTop: 8,
//     fontSize: 14,
//   },
//   statusContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#E3F2FD',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 16,
//   },
//   statusText: {
//     marginLeft: 8,
//     color: '#1976D2',
//     fontSize: 14,
//   },
//   errorContainer: {
//     backgroundColor: '#FFEBEE',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 16,
//   },
//   errorText: {
//     color: '#C62828',
//     fontSize: 14,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 24,
//   },
//   button: {
//     backgroundColor: '#E0E0E0',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     minWidth: 140,
//     alignItems: 'center',
//   },
//   primaryButton: {
//     backgroundColor: '#4A90E2',
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: '600',
//     fontSize: 14,
//   },
//   materialsSection: {
//     marginBottom: 24,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 12,
//     color: '#333',
//   },
//   materialCard: {
//     backgroundColor: 'white',
//     borderRadius: 8,
//     padding: 12,
//     marginRight: 12,
//     width: 100,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   selectedMaterial: {
//     borderWidth: 2,
//     borderColor: '#4A90E2',
//   },
//   materialColor: {
//     width: 60,
//     height: 60,
//     borderRadius: 8,
//     marginBottom: 8,
//   },
//   materialName: {
//     fontSize: 12,
//     fontWeight: '600',
//     textAlign: 'center',
//   },
//   materialCategory: {
//     fontSize: 10,
//     color: '#999',
//     marginTop: 2,
//   },
//   infoBox: {
//     backgroundColor: 'white',
//     padding: 16,
//     borderRadius: 8,
//     marginTop: 8,
//   },
//   infoTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 8,
//     color: '#333',
//   },
//   infoText: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 4,
//   },
// });

// import React, { useState, useEffect } from 'react';
// import {
//   StyleSheet,
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
//   SafeAreaView,
//   ActivityIndicator,
//   ScrollView,
//   Dimensions,
//   Alert,
// } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { useImageSegmentation, DEEPLAB_V3_RESNET50 } from 'react-native-executorch';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';

// const { width: screenWidth } = Dimensions.get('window');

// const MATERIALS = [
//   { id: 1, name: 'Ceramic White', category: 'wall', color: '#F5F5F5' },
//   { id: 2, name: 'Wood Grain', category: 'floor', color: '#8B4513' },
//   { id: 3, name: 'Marble Gray', category: 'wall', color: '#808080' },
//   { id: 4, name: 'Oak Floor', category: 'floor', color: '#DEB887' },
//   { id: 5, name: 'Brick Red', category: 'wall', color: '#B22222' },
//   { id: 6, name: 'Slate Tile', category: 'floor', color: '#2F4F4F' },
// ];

// export default function App() {
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);
//   const [segmentationMask, setSegmentationMask] = useState<number[] | null>(null);
//   const [selectedMaterial, setSelectedMaterial] = useState<typeof MATERIALS[0] | null>(null);
//   const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
//   const [showMaterials, setShowMaterials] = useState(false);

//   // ✅ Correct model initialization
//   const model = useImageSegmentation(DEEPLAB_V3_RESNET50);

//   useEffect(() => {
//     (async () => {
//       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission needed', 'Please grant gallery access to continue');
//       }
//     })();
//   }, []);

//   const pickImage = async () => {
//     try {
//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         quality: 1,
//       });

//       if (!result.canceled && result.assets?.length) {
//         const uri = result.assets[0].uri;
//         setSelectedImage(uri);
//         setSegmentationMask(null);
//         setShowMaterials(false);

//         Image.getSize(uri, (width, height) => {
//           setImageDimensions({ width, height });
//         });
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Failed to pick image');
//     }
//   };

//   const runSegmentation = async () => {
//     if (!selectedImage) {
//       Alert.alert('Error', 'Please select an image first');
//       return;
//     }

//     if (!model?.isReady) {
//       Alert.alert('Error', 'Model is still loading');
//       return;
//     }

//     try {
//       /**
//        * DeepLab V3 Pascal VOC class IDs:
//        * 0 = background
//        * 11 = diningtable
//        * 12 = dog
//        * (Real wall/floor classes vary depending on model variant)
//        *
//        * Since your label enum isn't available,
//        * we'll just request full segmentation map.
//        */

//       const output = await model.forward(selectedImage, undefined, true);

//       if (!output || !output.argmax) {
//         Alert.alert('Error', 'Model returned invalid output');
//         return;
//       }

//       setSegmentationMask(output.argmax ?? null);
//       setShowMaterials(true);

//       Alert.alert('Success', 'Segmentation completed!');
//     } catch (error) {
//       console.error('Segmentation failed:', error);
//       Alert.alert('Error', 'Failed to analyze image');
//     }
//   };

//   const applyMaterial = (material: typeof MATERIALS[0]) => {
//     if (!selectedImage || !segmentationMask || !imageDimensions) {
//       Alert.alert('Error', 'No segmentation data available');
//       return;
//     }

//     setSelectedMaterial(material);

//     Alert.alert(
//       'Material Applied',
//       `${material.name} applied to ${material.category}s!\n\n(3D rendering layer not implemented yet.)`
//     );
//   };

//   return (
//     <GestureHandlerRootView style={styles.container}>
//       <SafeAreaView style={styles.safeArea}>
//         <View style={styles.header}>
//           <Text style={styles.headerTitle}>Room Visualizer</Text>
//           <Text style={styles.headerSubtitle}>AI-Powered Design</Text>
//         </View>

//         <ScrollView contentContainerStyle={styles.scrollContent}>
//           <View style={styles.imageContainer}>
//             {selectedImage ? (
//               <>
//                 <Image source={{ uri: selectedImage }} style={styles.image} />
//                 {model.isGenerating && (
//                   <View style={styles.loadingOverlay}>
//                     <ActivityIndicator size="large" color="#4A90E2" />
//                     <Text style={styles.loadingText}>Analyzing room...</Text>
//                   </View>
//                 )}
//               </>
//             ) : (
//               <View style={styles.placeholderImage}>
//                 <Text style={styles.placeholderText}>No image selected</Text>
//               </View>
//             )}
//           </View>

//           {!model.isReady && !model.error && (
//             <View style={styles.statusContainer}>
//               <ActivityIndicator size="small" color="#4A90E2" />
//               <Text style={styles.statusText}>
//                 Loading AI model... {Math.round((model.downloadProgress ?? 0) * 100)}%
//               </Text>
//             </View>
//           )}

//           {model.error && (
//             <View style={styles.errorContainer}>
//               <Text style={styles.errorText}>Error loading model: {model.error}</Text>
//             </View>
//           )}

//           <View style={styles.buttonContainer}>
//             <TouchableOpacity style={styles.button} onPress={pickImage}>
//               <Text style={styles.buttonText}>📸 Pick Room Photo</Text>
//             </TouchableOpacity>

//             {selectedImage && (
//               <TouchableOpacity
//                 style={[styles.button, styles.primaryButton]}
//                 onPress={runSegmentation}
//                 disabled={!model.isReady || model.isGenerating}
//               >
//                 <Text style={styles.buttonText}>
//                   {model.isGenerating ? 'Analyzing...' : '🔍 Run Segmentation'}
//                 </Text>
//               </TouchableOpacity>
//             )}
//           </View>

//           {showMaterials && segmentationMask && (
//             <View style={styles.materialsSection}>
//               <Text style={styles.sectionTitle}>Select Material</Text>
//               <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//                 {MATERIALS.map((material) => (
//                   <TouchableOpacity
//                     key={material.id}
//                     style={[
//                       styles.materialCard,
//                       selectedMaterial?.id === material.id && styles.selectedMaterial,
//                     ]}
//                     onPress={() => applyMaterial(material)}
//                   >
//                     <View
//                       style={[
//                         styles.materialColor,
//                         { backgroundColor: material.color },
//                       ]}
//                     />
//                     <Text style={styles.materialName}>{material.name}</Text>
//                     <Text style={styles.materialCategory}>{material.category}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </ScrollView>
//             </View>
//           )}

//           <View style={styles.infoBox}>
//             <Text style={styles.infoTitle}>How it works:</Text>
//             <Text style={styles.infoText}>1. Upload a photo</Text>
//             <Text style={styles.infoText}>2. AI segments the scene</Text>
//             <Text style={styles.infoText}>3. Choose materials</Text>
//             <Text style={styles.infoText}>4. 3D overlay coming next</Text>
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     </GestureHandlerRootView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5F5F5',
//   },
//   safeArea: {
//     flex: 1,
//   },
//   header: {
//     padding: 20,
//     backgroundColor: '#4A90E2',
//     alignItems: 'center',
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: 'white',
//   },
//   headerSubtitle: {
//     fontSize: 14,
//     color: 'rgba(255,255,255,0.8)',
//     marginTop: 4,
//   },
//   scrollContent: {
//     padding: 16,
//   },
//   imageContainer: {
//     width: screenWidth - 32,
//     height: 300,
//     backgroundColor: '#E0E0E0',
//     borderRadius: 12,
//     overflow: 'hidden',
//     marginBottom: 16,
//     position: 'relative',
//   },
//   image: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'cover',
//   },
//   placeholderImage: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   placeholderText: {
//     color: '#999',
//     fontSize: 16,
//   },
//   loadingOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     color: 'white',
//     marginTop: 8,
//     fontSize: 14,
//   },
//   statusContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#E3F2FD',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 16,
//   },
//   statusText: {
//     marginLeft: 8,
//     color: '#1976D2',
//     fontSize: 14,
//   },
//   errorContainer: {
//     backgroundColor: '#FFEBEE',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 16,
//   },
//   errorText: {
//     color: '#C62828',
//     fontSize: 14,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 24,
//   },
//   button: {
//     backgroundColor: '#E0E0E0',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     minWidth: 140,
//     alignItems: 'center',
//   },
//   primaryButton: {
//     backgroundColor: '#4A90E2',
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: '600',
//     fontSize: 14,
//   },
//   materialsSection: {
//     marginBottom: 24,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 12,
//     color: '#333',
//   },
//   materialCard: {
//     backgroundColor: 'white',
//     borderRadius: 8,
//     padding: 12,
//     marginRight: 12,
//     width: 100,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   selectedMaterial: {
//     borderWidth: 2,
//     borderColor: '#4A90E2',
//   },
//   materialColor: {
//     width: 60,
//     height: 60,
//     borderRadius: 8,
//     marginBottom: 8,
//   },
//   materialName: {
//     fontSize: 12,
//     fontWeight: '600',
//     textAlign: 'center',
//   },
//   materialCategory: {
//     fontSize: 10,
//     color: '#999',
//     marginTop: 2,
//   },
//   infoBox: {
//     backgroundColor: 'white',
//     padding: 16,
//     borderRadius: 8,
//     marginTop: 8,
//   },
//   infoTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 8,
//     color: '#333',
//   },
//   infoText: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 4,
//   },
// });

// *********************************************Working code**********************************

// import React, { useState, useEffect } from 'react';
// import {
//   StyleSheet,
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
//   SafeAreaView,
//   ActivityIndicator,
//   ScrollView,
//   Dimensions,
//   Alert,
// } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import {
//   useImageSegmentation,
//   DEEPLAB_V3_RESNET50,
// } from 'react-native-executorch';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';

// const { width: screenWidth } = Dimensions.get('window');

// const MATERIALS = [
//   { id: 1, name: 'Ceramic White', category: 'wall', color: '#F5F5F5' },
//   { id: 2, name: 'Wood Grain', category: 'floor', color: '#8B4513' },
//   { id: 3, name: 'Marble Gray', category: 'wall', color: '#808080' },
//   { id: 4, name: 'Oak Floor', category: 'floor', color: '#DEB887' },
//   { id: 5, name: 'Brick Red', category: 'wall', color: '#B22222' },
//   { id: 6, name: 'Slate Tile', category: 'floor', color: '#2F4F4F' },
// ];

// type SegmentationMap = Record<string, number[]>;

// export default function App() {
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);
//   const [segmentationMask, setSegmentationMask] =
//     useState<SegmentationMap | null>(null);
//   const [selectedMaterial, setSelectedMaterial] =
//     useState<typeof MATERIALS[0] | null>(null);
//   const [imageDimensions, setImageDimensions] =
//     useState<{ width: number; height: number } | null>(null);
//   const [showMaterials, setShowMaterials] = useState(false);

//   const model = useImageSegmentation({
//   model: DEEPLAB_V3_RESNET50,
// });

//   useEffect(() => {
//     (async () => {
//       const { status } =
//         await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert(
//           'Permission needed',
//           'Please grant gallery access to continue'
//         );
//       }
//     })();
//   }, []);

//   const pickImage = async () => {
//     try {
//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         quality: 1,
//       });

//       if (!result.canceled && result.assets?.length) {
//         const uri = result.assets[0].uri;

//         setSelectedImage(uri);
//         setSegmentationMask(null);
//         setShowMaterials(false);
//         setSelectedMaterial(null);

//         Image.getSize(uri, (width, height) => {
//           setImageDimensions({ width, height });
//         });
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Failed to pick image');
//     }
//   };

//   const runSegmentation = async () => {
//     if (!selectedImage) {
//       Alert.alert('Error', 'Please select an image first');
//       return;
//     }

//     if (!model?.isReady) {
//       Alert.alert('Error', 'Model is still loading');
//       return;
//     }

//     try {
//       // ✅ Correct call — NO extra args, NO argmax
//       const output = (await model.forward(
//         selectedImage
//       )) as SegmentationMap;

//       if (!output) {
//         Alert.alert('Error', 'Segmentation failed');
//         return;
//       }

//       setSegmentationMask(output);
//       setShowMaterials(true);

//       Alert.alert('Success', 'Segmentation completed!');
//     } catch (error) {
//       console.error('Segmentation failed:', error);
//       Alert.alert('Error', 'Failed to analyze image');
//     }
//   };

//   const applyMaterial = (material: typeof MATERIALS[0]) => {
//     if (!selectedImage || !segmentationMask || !imageDimensions) {
//       Alert.alert('Error', 'No segmentation data available');
//       return;
//     }

//     setSelectedMaterial(material);

//     Alert.alert(
//       'Material Applied',
//       `${material.name} applied!\n\n(3D overlay layer not implemented yet.)`
//     );
//   };

//   return (
//     <GestureHandlerRootView style={styles.container}>
//       <SafeAreaView style={styles.safeArea}>
//         <View style={styles.header}>
//           <Text style={styles.headerTitle}>Room Visualizer</Text>
//           <Text style={styles.headerSubtitle}>AI-Powered Design</Text>
//         </View>

//         <ScrollView contentContainerStyle={styles.scrollContent}>
//           <View style={styles.imageContainer}>
//             {selectedImage ? (
//               <>
//                 <Image
//                   source={{ uri: selectedImage }}
//                   style={styles.image}
//                 />
//                 {model.isGenerating && (
//                   <View style={styles.loadingOverlay}>
//                     <ActivityIndicator
//                       size="large"
//                       color="#4A90E2"
//                     />
//                     <Text style={styles.loadingText}>
//                       Analyzing room...
//                     </Text>
//                   </View>
//                 )}
//               </>
//             ) : (
//               <View style={styles.placeholderImage}>
//                 <Text style={styles.placeholderText}>
//                   No image selected
//                 </Text>
//               </View>
//             )}
//           </View>

//           {!model.isReady && !model.error && (
//             <View style={styles.statusContainer}>
//               <ActivityIndicator
//                 size="small"
//                 color="#4A90E2"
//               />
//               <Text style={styles.statusText}>
//                 Loading AI model...{' '}
//                 {Math.round(
//                   (model.downloadProgress ?? 0) * 100
//                 )}
//                 %
//               </Text>
//             </View>
//           )}

//           {model.error && (
//             <View style={styles.errorContainer}>
//               <Text style={styles.errorText}>
//                 Error loading model: {"Error"}
//               </Text>
//             </View>
//           )}

//           <View style={styles.buttonContainer}>
//             <TouchableOpacity
//               style={[styles.button, styles.primaryButton]}
//               onPress={pickImage}
//             >
//               <Text style={styles.buttonText}>
//                 📸 Pick Room Photo
//               </Text>
//             </TouchableOpacity>

//             {selectedImage && (
//               <TouchableOpacity
//                 style={[
//                   styles.button,
//                   styles.primaryButton,
//                 ]}
//                 onPress={runSegmentation}
//                 disabled={
//                   !model.isReady || model.isGenerating
//                 }
//               >
//                 <Text style={styles.buttonText}>
//                   {model.isGenerating
//                     ? 'Analyzing...'
//                     : '🔍 Run Segmentation'}
//                 </Text>
//               </TouchableOpacity>
//             )}
//           </View>

//           {showMaterials && segmentationMask && (
//             <View style={styles.materialsSection}>
//               <Text style={styles.sectionTitle}>
//                 Select Material
//               </Text>
//               <ScrollView
//                 horizontal
//                 showsHorizontalScrollIndicator={false}
//               >
//                 {MATERIALS.map((material) => (
//                   <TouchableOpacity
//                     key={material.id}
//                     style={[
//                       styles.materialCard,
//                       selectedMaterial?.id ===
//                         material.id &&
//                         styles.selectedMaterial,
//                     ]}
//                     onPress={() =>
//                       applyMaterial(material)
//                     }
//                   >
//                     <View
//                       style={[
//                         styles.materialColor,
//                         {
//                           backgroundColor:
//                             material.color,
//                         },
//                       ]}
//                     />
//                     <Text style={styles.materialName}>
//                       {material.name}
//                     </Text>
//                     <Text style={styles.materialCategory}>
//                       {material.category}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </ScrollView>
//             </View>
//           )}

//           <View style={styles.infoBox}>
//             <Text style={styles.infoTitle}>
//               How it works:
//             </Text>
//             <Text style={styles.infoText}>
//               1. Upload a photo
//             </Text>
//             <Text style={styles.infoText}>
//               2. AI segments the scene
//             </Text>
//             <Text style={styles.infoText}>
//               3. Choose materials
//             </Text>
//             <Text style={styles.infoText}>
//               4. 3D overlay coming next
//             </Text>
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     </GestureHandlerRootView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#F5F5F5' },
//   safeArea: { flex: 1 },
//   header: {
//     padding: 20,
//     backgroundColor: '#4A90E2',
//     alignItems: 'center',
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: 'white',
//   },
//   headerSubtitle: {
//     fontSize: 14,
//     color: 'rgba(255,255,255,0.8)',
//     marginTop: 4,
//   },
//   scrollContent: { padding: 16 },
//   imageContainer: {
//     width: screenWidth - 32,
//     height: 300,
//     backgroundColor: '#E0E0E0',
//     borderRadius: 12,
//     overflow: 'hidden',
//     marginBottom: 16,
//     position: 'relative',
//   },
//   image: { width: '100%', height: '100%', resizeMode: 'cover' },
//   placeholderImage: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   placeholderText: { color: '#999', fontSize: 16 },
//   loadingOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: { color: 'white', marginTop: 8, fontSize: 14 },
//   statusContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#E3F2FD',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 16,
//   },
//   statusText: { marginLeft: 8, color: '#1976D2' },
//   errorContainer: {
//     backgroundColor: '#FFEBEE',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 16,
//   },
//   errorText: { color: '#C62828' },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 24,
//   },
//   button: {
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     minWidth: 140,
//     alignItems: 'center',
//     backgroundColor: '#4A90E2',
//   },
//   primaryButton: {
//   backgroundColor: '#4A90E2',
// },
//   buttonText: {
//     color: 'white',
//     fontWeight: '600',
//     fontSize: 14,
//   },
//   materialsSection: { marginBottom: 24 },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 12,
//   },
//   materialCard: {
//     backgroundColor: 'white',
//     borderRadius: 8,
//     padding: 12,
//     marginRight: 12,
//     width: 100,
//     alignItems: 'center',
//     elevation: 3,
//   },
//   selectedMaterial: {
//     borderWidth: 2,
//     borderColor: '#4A90E2',
//   },
//   materialColor: {
//     width: 60,
//     height: 60,
//     borderRadius: 8,
//     marginBottom: 8,
//   },
//   materialName: {
//     fontSize: 12,
//     fontWeight: '600',
//     textAlign: 'center',
//   },
//   materialCategory: {
//     fontSize: 10,
//     color: '#999',
//     marginTop: 2,
//   },
//   infoBox: {
//     backgroundColor: 'white',
//     padding: 16,
//     borderRadius: 8,
//     marginTop: 8,
//   },
//   infoTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
//   infoText: {
//     fontSize: 14,
//     marginBottom: 4,
//   },
// });

// // ***************************************** AR Code ***********************************************

// import React, { useState, useEffect } from 'react';
// import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
// import { BlurView } from '@react-native-community/blur';
// import {
//   ViroARScene,
//   ViroARSceneNavigator,
//   ViroARPlane,
//   ViroQuad,
//   ViroMaterials,
//   ViroAmbientLight,
// } from '@viro-community/react-viro';

// // ────────────────────────────────────────────────
// // Material Database (array – easy to replace with API/DB later)
// // All URIs are direct image links to free/seamless/CC0 textures
// // ────────────────────────────────────────────────
// const tileMaterials = [
//   // Floors
//   { name: 'Marble White', uri: 'https://dl.polyhaven.com/file/ph-asset-lib/textures/marble_01/marble_01_diff_8k.jpg', repeatFactor: 8 },
//   { name: 'Wood Parquet', uri: 'https://textures.com/system/gallery/photos/Floors/WoodParquet/12345/WoodParquet0123_1_600.jpg', repeatFactor: 6 },
//   { name: 'Gray Concrete Tiles', uri: 'https://dl.polyhaven.com/file/ph-asset-lib/textures/concrete_tiles/concrete_tiles_diff_8k.jpg', repeatFactor: 10 },
//   { name: 'Hexagonal Mosaic', uri: 'https://www.sketchuptextureclub.com/storage/textures/architecture/tiles-interior/mosaico/hexagonal-mixed/hexagonal-mixed-001.jpg', repeatFactor: 5 },
//   { name: 'Dark Stone Floor', uri: 'https://dl.polyhaven.com/file/ph-asset-lib/textures/stone_floor_01/stone_floor_01_diff_8k.jpg', repeatFactor: 7 },

//   // Walls
//   { name: 'White Subway Tile', uri: 'https://textures.com/system/gallery/photos/Walls/Tiles/Subway/98765/SubwayTileWhite_1_600.jpg', repeatFactor: 12 },
//   { name: 'Blue Geometric Wall', uri: 'https://www.sketchuptextureclub.com/storage/textures/architecture/tiles-interior/marble-tiles/blue/marble-tiles-blue-001.jpg', repeatFactor: 8 },
//   { name: 'Terrazzo Classic', uri: 'https://dl.polyhaven.com/file/ph-asset-lib/textures/terrazzo_tiles/terrazzo_tiles_diff_16k.jpg', repeatFactor: 9 },
//   { name: 'Brick Wall Tile', uri: 'https://textures.com/system/gallery/photos/Walls/Bricks/54321/BrickWallRed_1_600.jpg', repeatFactor: 15 },
//   { name: 'Marble Wall Veins', uri: 'https://dl.polyhaven.com/file/ph-asset-lib/textures/marble_wall/marble_wall_diff_8k.jpg', repeatFactor: 6 },
// ];

// interface ARSceneProps {
//   selectedFloorMat: string;
//   selectedWallMat: string;
// }

// const ARScene = ({ selectedFloorMat, selectedWallMat }: ARSceneProps) => {
//   const [floorSize, setFloorSize] = useState({ width: 1.0, height: 1.0 });
//   const [wallSize, setWallSize] = useState({ width: 1.0, height: 1.0 });

//   useEffect(() => {
//     // Give Viro bridge extra time to initialize (common workaround for this exact null error)
//     const timer = setTimeout(() => {
//       tileMaterials.forEach((mat) => {
//         const safeKey = mat.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
//         ViroMaterials.createMaterials({
//           [safeKey]: {
//             diffuseTexture: { uri: mat.uri },
//             lightingModel: 'Phong', // nicer shading
//           },
//         });
//       });
//     }, 100); // 100ms delay – increase to 300 if still crashes

//     return () => clearTimeout(timer);
//   }, []); // empty deps = run once on mount

//   const floorMatObj = tileMaterials.find(m => m.name === selectedFloorMat);
//   const wallMatObj  = tileMaterials.find(m => m.name === selectedWallMat);

//   const floorRepeat = floorMatObj?.repeatFactor ?? 6;
//   const wallRepeat  = wallMatObj?.repeatFactor  ?? 8;

//   const floorUV = [
//     0, 0,
//     floorSize.width * floorRepeat, 0,
//     floorSize.width * floorRepeat, floorSize.height * floorRepeat,
//     0, floorSize.height * floorRepeat,
//   ];

//   const wallUV = [
//     0, 0,
//     wallSize.width * wallRepeat, 0,
//     wallSize.width * wallRepeat, wallSize.height * wallRepeat,
//     0, wallSize.height * wallRepeat,
//   ];

//   const floorMatKey = selectedFloorMat.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
//   const wallMatKey  = selectedWallMat.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');

//   return (
//     <ViroARScene>
//       <ViroAmbientLight color="#ffffff" intensity={600} />

//       {/* Floor */}
//       <ViroARPlane
//         minHeight={0.3}
//         minWidth={0.3}
//         alignment="Horizontal"
//         onAnchorUpdated={(anchor) => {
//           if (anchor.width && anchor.height) {
//             setFloorSize({ width: anchor.width, height: anchor.height });
//           }
//         }}
//       >
//         <ViroQuad
//           rotation={[-90, 0, 0]}
//           position={[0, 0, 0]}
//           width={floorSize.width}
//           height={floorSize.height}
//           materials={[floorMatKey]}
//           uvCoordinates={floorUV as any} // Viro typings are incomplete → common workaround
//         />
//       </ViroARPlane>

//       {/* Wall */}
//       <ViroARPlane
//         minHeight={0.3}
//         minWidth={0.3}
//         alignment="Vertical"
//         onAnchorUpdated={(anchor) => {
//           if (anchor.width && anchor.height) {
//             setWallSize({ width: anchor.width, height: anchor.height });
//           }
//         }}
//       >
//         <ViroQuad
//           rotation={[0, 0, 0]}
//           position={[0, 0, 0]}
//           width={wallSize.width}
//           height={wallSize.height}
//           materials={[wallMatKey]}
//           uvCoordinates={wallUV as any}
//         />
//       </ViroARPlane>
//     </ViroARScene>
//   );
// };

// export default function App() {
//   const [selectedFloorMat, setSelectedFloorMat] = useState(tileMaterials[0].name);
//   const [selectedWallMat, setSelectedWallMat] = useState(tileMaterials[5].name);

//   return (
//     <View style={styles.container}>
//       <ViroARSceneNavigator
//         autofocus={true}
//         initialScene={{
//           scene: () => (
//             <ARScene
//               selectedFloorMat={selectedFloorMat}
//               selectedWallMat={selectedWallMat}
//             />
//           ),
//         }}
//         style={styles.arView}
//       />

//       {/* Premium glassy overlay */}
//       <BlurView
//         style={styles.controlsContainer}
//         blurType="dark"
//         blurAmount={20}
//         reducedTransparencyFallbackColor="rgba(30,30,40,0.7)"
//       >
//         <View style={styles.glassCard}>
//           <Text style={styles.title}>Floor Material</Text>
//           <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
//             {tileMaterials
//               .filter(m => ['Marble', 'Wood', 'Concrete', 'Mosaic', 'Stone'].some(k => m.name.includes(k)))
//               .map(mat => (
//                 <TouchableOpacity
//                   key={mat.name}
//                   style={[
//                     styles.matButton,
//                     selectedFloorMat === mat.name && styles.matButtonSelected,
//                   ]}
//                   onPress={() => setSelectedFloorMat(mat.name)}
//                 >
//                   <Text style={styles.matText}>{mat.name}</Text>
//                 </TouchableOpacity>
//               ))}
//           </ScrollView>

//           <Text style={styles.title}>Wall Material</Text>
//           <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
//             {tileMaterials
//               .filter(m => ['Tile', 'Wall', 'Terrazzo', 'Brick', 'Marble'].some(k => m.name.includes(k)))
//               .map(mat => (
//                 <TouchableOpacity
//                   key={mat.name}
//                   style={[
//                     styles.matButton,
//                     selectedWallMat === mat.name && styles.matButtonSelected,
//                   ]}
//                   onPress={() => setSelectedWallMat(mat.name)}
//                 >
//                   <Text style={styles.matText}>{mat.name}</Text>
//                 </TouchableOpacity>
//               ))}
//           </ScrollView>
//         </View>
//       </BlurView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   arView: { flex: 1 },

//   controlsContainer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: 20,
//     paddingBottom: 40,
//   },

//   glassCard: {
//     backgroundColor: 'rgba(40, 40, 60, 0.35)',
//     borderRadius: 24,
//     borderWidth: 1,
//     borderColor: 'rgba(255,255,255,0.18)',
//     padding: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: 0.4,
//     shadowRadius: 20,
//     elevation: 10,
//   },

//   title: {
//     color: '#ffffff',
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 12,
//     textAlign: 'center',
//   },

//   scroll: {
//     marginBottom: 20,
//   },

//   matButton: {
//     backgroundColor: 'rgba(255,255,255,0.12)',
//     borderRadius: 16,
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     marginRight: 12,
//     borderWidth: 1,
//     borderColor: 'rgba(255,255,255,0.2)',
//   },

//   matButtonSelected: {
//     backgroundColor: 'rgba(100, 180, 255, 0.4)',
//     borderColor: '#60a0ff',
//   },

//   matText: {
//     color: '#ffffff',
//     fontSize: 15,
//     fontWeight: '500',
//   },
// });

// // **********************************************End of AR code **************************************


import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Alert,
  Modal,
  Platform,
  StatusBar,
  Animated,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useImageSegmentation, DEEPLAB_V3_RESNET50, DeeplabLabel } from 'react-native-executorch';
import { GestureHandlerRootView, PinchGestureHandler } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ViewShot from 'react-native-view-shot';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Material and categories setup
const PREMIUM_MATERIALS = [
  { id: 'w1', name: 'Venetian Plaster', category: 'wall', color: '#E6D5B8', brand: 'Luxury Collection', price: '$89/m²' },
  { id: 'w2', name: 'Textured Linen', category: 'wall', color: '#F0E9DE', brand: 'Designer Series', price: '$65/m²' },
  { id: 'f1', name: 'Herringbone Oak', category: 'floor', color: '#D2B48C', brand: 'Timber Luxe', price: '$99/m²' },
  { id: 'f2', name: 'Polished Marble', category: 'floor', color: '#F8F8F8', brand: 'Stone Italia', price: '$149/m²' },
];

const CATEGORIES = [
  { id: 'all', name: 'All', icon: 'view-grid' },
  { id: 'wall', name: 'Walls', icon: 'wall' },
  { id: 'floor', name: 'Floors', icon: 'floor-plan' },
  { id: 'premium', name: 'Premium', icon: 'star' },
];

export default function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [wallMaterial, setWallMaterial] = useState<any | null>(null);
  const [floorMaterial, setFloorMaterial] = useState<any | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [showMaterialSelector, setShowMaterialSelector] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeSurface, setActiveSurface] = useState<'wall' | 'floor' | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [zoomLevel, setZoomLevel] = useState(1);

  const viewShotRef = useRef<ViewShot>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;

  const model = useImageSegmentation({
  model: DEEPLAB_V3_RESNET50,
});

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant gallery access to continue');
      }
    })();

    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setSelectedImage(uri);
      setWallMaterial(null);
      setFloorMaterial(null);
      Image.getSize(uri, (width, height) => setImageDimensions({ width, height }));
    }
  };

  const toggleFavorite = (materialId: string) => {
    setFavorites(prev => (prev.includes(materialId) ? prev.filter(id => id !== materialId) : [...prev, materialId]));
  };

  const getFilteredMaterials = () => {
    if (selectedCategory === 'all') return PREMIUM_MATERIALS;
    if (selectedCategory === 'premium') return PREMIUM_MATERIALS.filter(m => m.id.startsWith('p'));
    return PREMIUM_MATERIALS.filter(m => m.category === selectedCategory);
  };

  const applyMaterial = (material: any) => {
    if (activeSurface === 'wall') setWallMaterial(material);
    if (activeSurface === 'floor') setFloorMaterial(material);
    setShowMaterialSelector(false);
  };

  const onPinchEvent = (event: any) => {
    setZoomLevel(Math.max(1, Math.min(3, event.nativeEvent.scale)));
  };

  const saveDesign = async () => {
    if (viewShotRef.current) {
      const uri = await viewShotRef.current?.capture?.()
;
      Alert.alert('Saved!', 'Your design has been saved to gallery.');
    }
  };

  const renderMaterialSelector = () => (
    <Modal visible={showMaterialSelector} transparent animationType="slide">
      <BlurView intensity={90} style={styles.modalOverlay}>
        <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>
          <LinearGradient colors={['#fff', '#f0f0f0']} style={styles.modalGradient}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Material</Text>
              <TouchableOpacity onPress={() => setShowMaterialSelector(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Surface tabs */}
            <View style={styles.surfaceTabs}>
              <TouchableOpacity
                style={[styles.surfaceTab, activeSurface === 'wall' && styles.activeSurfaceTab]}
                onPress={() => setActiveSurface('wall')}
              >
                <MaterialCommunityIcons name="wall" size={20} color={activeSurface === 'wall' ? '#4A90E2' : '#999'} />
                <Text style={[styles.surfaceTabText, activeSurface === 'wall' && styles.activeSurfaceText]}>Walls</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.surfaceTab, activeSurface === 'floor' && styles.activeSurfaceTab]}
                onPress={() => setActiveSurface('floor')}
              >
                <MaterialCommunityIcons name="floor-plan" size={20} color={activeSurface === 'floor' ? '#4A90E2' : '#999'} />
                <Text style={[styles.surfaceTabText, activeSurface === 'floor' && styles.activeSurfaceText]}>Floors</Text>
              </TouchableOpacity>
            </View>

            {/* Categories */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.categoryChip, selectedCategory === cat.id && styles.activeCategoryChip]}
                  onPress={() => setSelectedCategory(cat.id)}
                >
                  <MaterialCommunityIcons name={cat.icon as any} size={16} color={selectedCategory === cat.id ? 'white' : '#666'} />
                  <Text style={[styles.categoryChipText, selectedCategory === cat.id && styles.activeCategoryChipText]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <ScrollView style={styles.materialsGrid}>
              <View style={styles.materialsRow}>
                {getFilteredMaterials().map(material => (
                  <TouchableOpacity
                    key={material.id}
                    style={[styles.materialCard, (activeSurface === 'wall' && wallMaterial?.id === material.id) || (activeSurface === 'floor' && floorMaterial?.id === material.id) ? styles.selectedMaterialCard : null]}
                    onPress={() => applyMaterial(material)}
                  >
                    <LinearGradient colors={[material.color, material.color]} style={styles.materialPreview}>
                      <TouchableOpacity style={styles.favoriteButton} onPress={() => toggleFavorite(material.id)}>
                        <MaterialCommunityIcons
                          name={favorites.includes(material.id) ? 'heart' : 'heart-outline'}
                          size={20}
                          color={favorites.includes(material.id) ? '#FF6B6B' : 'white'}
                        />
                      </TouchableOpacity>
                    </LinearGradient>
                    <View style={styles.materialInfo}>
                      <Text style={styles.materialName}>{material.name}</Text>
                      <Text style={styles.materialBrand}>{material.brand}</Text>
                      <Text style={styles.materialPrice}>{material.price}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </LinearGradient>
        </Animated.View>
      </BlurView>
    </Modal>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#0A0F1E', '#1A1F2E']} style={styles.backgroundGradient}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <PinchGestureHandler onGestureEvent={onPinchEvent}>
              <Animated.View style={[styles.imageContainer, { transform: [{ scale: zoomLevel }] }]}>
                {selectedImage ? (
                  <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 0.9 }}>
                    <Image
                      source={{ uri: selectedImage }}
                      style={[styles.image, imageDimensions && { width: screenWidth - 32, height: (screenWidth - 32) * (imageDimensions.height / imageDimensions.width) }]}
                    />
                  </ViewShot>
                ) : (
                  <TouchableOpacity style={styles.placeholderImage} onPress={pickImage}>
                    <MaterialCommunityIcons name="image-plus" size={50} color="#4A90E2" />
                    <Text style={styles.placeholderText}>Upload Room Photo</Text>
                  </TouchableOpacity>
                )}
              </Animated.View>
            </PinchGestureHandler>

            {/* Quick Action Bar */}
            {selectedImage && (
              <BlurView intensity={70} tint="dark" style={styles.actionsBar}>
                <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
                  <MaterialCommunityIcons name="image" size={22} color="white" />
                  <Text style={styles.actionText}>Change</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => { setActiveSurface('wall'); setShowMaterialSelector(true); }}>
                  <MaterialCommunityIcons name="wall" size={22} color={wallMaterial ? '#4A90E2' : 'white'} />
                  <Text style={styles.actionText}>Walls</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => { setActiveSurface('floor'); setShowMaterialSelector(true); }}>
                  <MaterialCommunityIcons name="floor-plan" size={22} color={floorMaterial ? '#4A90E2' : 'white'} />
                  <Text style={styles.actionText}>Floors</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={saveDesign}>
                  <MaterialCommunityIcons name="content-save" size={22} color="white" />
                  <Text style={styles.actionText}>Save</Text>
                </TouchableOpacity>
              </BlurView>
            )}

            {renderMaterialSelector()}
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </GestureHandlerRootView>
  );
}

// Keep your previous styles (can be copied as-is)


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'android' ? 25 : 0,
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  scrollContent: {
    padding: 16,
  },
  imageContainer: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  image: {
    width: screenWidth - 32,
    height: 300,
    resizeMode: 'contain',
  },
  placeholderImage: {
    width: screenWidth - 32,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  placeholderText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
  },
  placeholderSubtext: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    marginTop: 5,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
  },
  wallIndicator: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  floorIndicator: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  indicatorText: {
    color: 'white',
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '500',
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
    marginBottom: 16,
  },
  statusText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 14,
  },
  actionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    borderRadius: 25,
    marginBottom: 16,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
  },
  statsCard: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 15,
    marginBottom: 16,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  featuresCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  featuresTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  featureText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 14,
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: screenHeight * 0.8,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  modalGradient: {
    flex: 1,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1F2E',
  },
  surfaceTabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 25,
    padding: 4,
    marginBottom: 20,
  },
  surfaceTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 21,
  },
  activeSurfaceTab: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  surfaceTabText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#999',
  },
  activeSurfaceText: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  categoryScroll: {
    marginBottom: 15,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 20,
    marginRight: 10,
  },
  activeCategoryChip: {
    backgroundColor: '#4A90E2',
  },
  categoryChipText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#666',
  },
  activeCategoryChipText: {
    color: 'white',
  },
  materialsGrid: {
    flex: 1,
  },
  materialsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  materialCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  selectedMaterialCard: {
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  materialPreview: {
    height: 100,
    position: 'relative',
  },
  materialPattern: {
    ...StyleSheet.absoluteFillObject,
  },
  woodPattern: {
    flex: 1,
    justifyContent: 'space-around',
    padding: 10,
  },
  woodGrain: {
    height: 2,
    backgroundColor: 'rgba(0,0,0,0.1)',
    width: '100%',
  },
  marblePattern: {
    flex: 1,
  },
  marbleVein1: {
    position: 'absolute',
    top: 20,
    left: 10,
    width: 60,
    height: 3,
    backgroundColor: 'rgba(0,0,0,0.1)',
    transform: [{ rotate: '15deg' }],
  },
  marbleVein2: {
    position: 'absolute',
    bottom: 30,
    right: 10,
    width: 40,
    height: 2,
    backgroundColor: 'rgba(0,0,0,0.1)',
    transform: [{ rotate: '-10deg' }],
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  materialInfo: {
    padding: 10,
  },
  materialName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1F2E',
  },
  materialBrand: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  materialFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  materialPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  materialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    color: '#4A90E2',
    marginLeft: 2,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  compareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  compareText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#4A90E2',
  },
  applyButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});