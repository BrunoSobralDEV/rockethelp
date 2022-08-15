import { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Text, VStack } from 'native-base';
import firestore from '@react-native-firebase/firestore';

import { dateFormat } from '../utils/firestoreDateFormat';

import { Header } from '../components/Header';
import { OderProps } from '../components/Order';
import { OrderFirestoreDTO } from '../DTOs/OrderFirestoreDTO';
import { Loading } from '../components/Loading';
import { Alert } from 'react-native';


type RouteParams = {
  orderId: string;
}

type OrderDatails = OderProps & {
  description: string;
  solution: string;
  closed: string;
}

export function Details() {
  const [solution, setSolution] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [oder, setOrder] = useState<OrderDatails>({} as OrderDatails);

  const route = useRoute();
  const { orderId } = route.params as RouteParams;

  const navigation = useNavigation();

  useEffect(() => {
    firestore()
    .collection<OrderFirestoreDTO>('orders')
    .doc(orderId)
    .get()
    .then((doc) => {
      const { patrimony, description, status, created_at, closed_at, solution} = doc.data();

      const closed = closed_at ? dateFormat(closed_at) : null;

      setOrder({
        id: doc.id,
        patrimony,
        description,
        status,
        solution,
        when: dateFormat(created_at),
        closed
      });
      
      setIsLoading(false);
    }).catch(error => {
      console.log(error)
      Alert.alert('Não encontrado', 'Solicitação não encontrado na base de dados, tente novamente.')
      navigation.goBack();
    })

  },[]);

  if (isLoading) {
    return <Loading />
  }

  return (
    <VStack flex={1} bg='gray.700'>
      <Header title='Solicitação'/>
      <Text color='white'>
        {orderId}
      </Text>
    </VStack>
  );
}