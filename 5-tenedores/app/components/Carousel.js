import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Image } from 'react-native-elements'
import Carousel from "react-native-banner-carousel"

export default function CarouselForm(props) {
    const { arrayImages, height, width } = props;

    return (
        <Carousel
            autoplay
            autoplayTimeout={5000}
            loop
            index={0}
            pageSize={width}
            pageIndicatoStyle={styles.indicator}
            activePageIndicatorStyle={styles.indicatorActive}
        >
            {arrayImages.map(urlImage => (
                <View key={urlImage}>
                    <Image
                        style={{ width, height }}
                        source={{ uri: urlImage }}
                    ></Image>
                </View>
            ))
            }
        </Carousel >
    )
}

const styles = StyleSheet.create({
    //puntitos de cada imagen
    indicator: {
        backgroundColor: "#006a68"
    },
    //circulo del indicador que este activo en ese momento
    indicatorActive: {
        backgroundColor: "#00ffc5"
    }
});