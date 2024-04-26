import React, { useEffect, useState } from "react";
import { View, ScrollView , Image} from "react-native";
import { Card, Title, Paragraph } from "react-native-paper";

export default function Cart({ route }) {
  const [result, setResult] = useState({});
  const [display, setDisplay] = useState({});

  useEffect(() => {
    if (route.params && route.params.result) {
      setResult(route.params.result);
    }
  }, [route.params]);

  useEffect(() => {
    getProducts();
  }, [result]);

  useEffect(() => {
    console.log("display", display);
  }, [display]);

  const getProducts = async () => {
    try {
      const response = await fetch("http://172.20.10.3:5000/recommend", {
        method: "POST",
        body: JSON.stringify({ result: result }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setDisplay(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const renderProductCards = (products, type) => {
    return (
      <View>
        <Card mode={'contained'} theme={{colors:{primary:'blue'}}} style={{ margin: 10}}>
        {products[0] && <Title>   {type}</Title>}
        </Card>
        <ScrollView horizontal={true} style={{ flexGrow: 0 }}>
          {products.map((product, index) => (
            <Card key={index} style={{ margin: 10, width: 200, height: 270}}>
              <Card.Content>
                <Title>{product[1]}</Title>
                <Image source={require('./Product Database/cream.png')} style={{ height: 100, width:100 }} />
                <Paragraph>Price: ${product[2]}</Paragraph>
                <Paragraph>Rating: {product[3]}★</Paragraph>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <ScrollView>
      <View>
        <Title>Recommended Products</Title>
        {display.acne && (
          <View>{renderProductCards(display.acne, "Acne")}</View>
        )}
        {display.blemishes && (
          <View>{renderProductCards(display.blemishes, "Blemishes")}</View>
        )}
        {display.lips && (
          <View>{renderProductCards(display.lips, "Lips")}</View>
        )}
        {display.darkCircles && (
          <View>{renderProductCards(display.darkCircles, "Dark Circles")}</View>
        )}
        {display.dryness && (
          <View>{renderProductCards(display.dryness, "Dryness")}</View>
        )}
      </View>
    </ScrollView>
  );
}
