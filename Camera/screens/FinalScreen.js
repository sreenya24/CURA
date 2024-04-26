import React, { useState, useEffect } from "react";
import { View, ScrollView, Image } from "react-native";
import {
  Card,
  ProgressBar,
  Title,
  Paragraph,
  Button,
} from "react-native-paper";
import * as FileSystem from "expo-file-system";

export default function FinalScreen({ route, navigation, bottomNavigator }) {
  const { photo } = route.params;
  const [result, setResult] = useState({});

  const [processingResult, setProcessingResult] = useState(
    "Processing image..."
  );
  const [acne, setAcne] = useState(0);
  const [blemishes, setBlemishes] = useState(0);
  const [lips, setLips] = useState(0);
  const [dryness, setDryness] = useState(0);
  const [darkCircles, setDarkCircles] = useState(0);

  const processImage = async () => {
    try {
      const base64 = await FileSystem.readAsStringAsync(photo, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const response = await fetch("http://172.20.10.3:5000/process-image", {
        method: "POST",
        body: JSON.stringify({ image_data: base64 }),
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();
      setResult(result);

      setProcessingResult("Image processed!");
      setAcne(result.acne);
      setBlemishes(result.blemishes);
      setLips(result.lips);
      setDryness(result.dryness);
      setDarkCircles(result.darkCircles);
      console.log(result);
    } catch (error) {
      console.error("Error:", error);
      setProcessingResult("Failed to process image.");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      // You can perform an action here if needed, or leave it empty to do nothing
      processImage();
    }, 3000); // 1000 milliseconds = 1 second
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <ScrollView>
        <Image
          source={{ uri: photo }}
          style={{ width: 150, height: 150, marginBottom: 20 }}
        />
        <Title style={{ textAlign: "center", marginBottom: 20 }}>
          {processingResult}
        </Title>
        <Card style={{ marginBottom: 10, width: "100%" }}>
          <Card.Content>
            <Paragraph>Acne</Paragraph>
            <ProgressBar progress={acne * 100} color="red" />
          </Card.Content>
        </Card>
        <Card style={{ marginBottom: 10, width: "100%" }}>
          <Card.Content>
            <Paragraph>Blemishes</Paragraph>
            <ProgressBar progress={blemishes * 100} color="blue" />
          </Card.Content>
        </Card>
        <Card style={{ marginBottom: 10, width: "100%" }}>
          <Card.Content>
            <Paragraph>Chapped Lips</Paragraph>
            <ProgressBar progress={lips * 100} color="purple" />
          </Card.Content>
        </Card>
        <Card style={{ marginBottom: 10, width: "100%" }}>
          <Card.Content>
            <Paragraph>Dryness</Paragraph>
            <ProgressBar progress={dryness * 100} color="orange" />
          </Card.Content>
        </Card>
        <Card style={{ marginBottom: 10, width: "100%" }}>
          <Card.Content>
            <Paragraph>Dark Circles</Paragraph>
            <ProgressBar progress={darkCircles * 100} color="green" />
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={() => navigation.navigate("Cart", { result: result })}
        >
          Product Recommendations
        </Button>
      </ScrollView>
    </View>
  );
}
