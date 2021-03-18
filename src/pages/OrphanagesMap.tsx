import React, { useState }  from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
// Ícones que já vem instalado com o expo
import { Feather } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
// Botão
import { RectButton } from 'react-native-gesture-handler';
import mapMarker from '../images/map-marker.png';
import api from '../services/api';

// Definir os dados que tenho dentro da minha variável orphanages
interface Orphanage { // Só os dados que vou usar dentro dessa tela
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}


export default function OrphanagesMap() {
  // Salvar os orfanatos dentro de um estado
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);
  
  const navigation = useNavigation();

  // Fazer chamada a API, assim que esse componente for exibido em tela
  useFocusEffect(() => {
    api.get('orphanages').then(response => {
     setOrphanages(response.data); // aonde vão estar os dados do meu orfanato
    });
  }); // Array de dependencia, que são as váriaveis quando elas mudarem eu vou execultar essa função de novo e se eu passar esse array vázio eu vou execultar ela uma vez


  // Qual que é o orfanato que eu cliquei, (mostrar os dados dele)
  function handleNavigateToOrphanageDetails(id: number) {
    navigation.navigate('OrphanageDetails', { id }); // Os parâmetro que quero enviar
  }

  // Primeira tela de criação de Orfanato
  function handleNavigationToCreateOrphanage() {
    navigation.navigate('SelectMapPosition');
  }


  return (
    <View style={styles.container}>
      <MapView 
        provider={PROVIDER_GOOGLE} // Usar mapa do google
        style={styles.map} 
        initialRegion={{ // De onde vai começar a localização
          latitude: -23.1398149,
          longitude: -45.8984255,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008,
        }} >

        {
          orphanages.map(orphanage => {
            return (
              <Marker 
              key={orphanage.id} // Preciso sempre colocar o key quando faço esse map para pegar as informações
                icon={mapMarker} 
                calloutAnchor={{ // Colocar nome do icone
                  x: 2.7,
                  y: 0.8,
                }}
                coordinate={{ // qual a posição que ele vai estar no mapa
                  latitude: orphanage.latitude,
                  longitude: orphanage.longitude,
                }} >

                <Callout tooltip={true} onPress={() => handleNavigateToOrphanageDetails(orphanage.id)}>
                  <View style={styles.calloutContainer}>
                    <Text style={styles.calloutText}>{orphanage.name}</Text>
                  </View>
                </Callout>
              </Marker>
            );
          })
        }
      </MapView>

      {/* Roda pé do cadastro de Orfanato */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>{orphanages.length} orfanatos encontrados</Text>

        {/* Esse cara é um botão, quando eu clico nele ele dá uma leve perda de opacidade */}
        <RectButton style={styles.createOrphanageButton} onPress={handleNavigationToCreateOrphanage}>
          <Feather name="plus" size={20} color="#FFF" />
        </RectButton>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  
    map: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },
  
    calloutContainer: {
      width: 160,
      height: 46,
      paddingHorizontal: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      borderRadius: 16,
      justifyContent: 'center',
    },
  
    calloutText: {
      color: '#0089a5',
      fontSize: 14,
      fontFamily: 'Nunito_700Bold',
    },
  
    footer: {
      position: 'absolute',
      left: 24,
      right: 24,
      bottom: 30, // Aqui fica o espasamento do cadastro de Orfanato, da tela do MAPA.
  
      backgroundColor: '#FFF',
      borderRadius: 20,
      height: 56,
      paddingLeft: 24,
  
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  
      elevation: 3,
    },
  
    footerText: {
      fontFamily: 'Nunito_700Bold',
      color: '#8fa1b3',
    },
  
    createOrphanageButton: {
      width: 56,
      height: 56,
      backgroundColor: '#15c3d6',
      borderRadius: 20,
  
      justifyContent: 'center',
      alignItems: 'center',
    },
  });