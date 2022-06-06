import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { number } from 'yup/lib/locale';
import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

interface Images {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface GetImageResponse {
  after: string;
  data: Images[];
}

export default function Home(): JSX.Element {
  // crio uma func que recebe um parametro e retorna a response da api
  async function fecthImages({ pageParam = null }): Promise<GetImageResponse> {
    const { data } = await api.get(`/api/images`, {
      // passo no parametro o que a func receber senão não passo nada
      params: {
        after: pageParam,
      },
    });
    return data;
  }

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', fecthImages, {
    getNextPageParam: lastPage => lastPage?.after || null,
  });

  // poderia fazer usando o useEffect e setando o valor num estado
  // pesquisar a diferença entre os dois métodos
  const formattedData = useMemo(() => {
    // pesquisar sobre o metodo flat de array>
    const formatted = data?.pages.flatMap(imageData => {
      return imageData.data.flat();
    });
    return formatted;
  }, [data]);

  if (isLoading && !isError) {
    return <Loading />;
  }

  if (!isLoading && isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {/* TODO RENDER LOAD MORE BUTTON IF DATA HAS NEXT PAGE */}
        {/* {hasNextPage && (
          <Button>

          </Button>
        )} */}
      </Box>
    </>
  );
}
