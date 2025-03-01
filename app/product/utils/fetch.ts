import { createClient } from '@/supabase/client';
import { GetServerSideProps } from 'next';

const supabase = createClient()

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { id } = params!;
  const { data: product, error } = await supabase
    .from('product')
    .select('id, name, desc, price, images, category(title)')
    .eq('id', id)
    .single();

  if (error || !product) {
    return {
      notFound: true,
    };
  }

  return {
    props: { product },
  };
};
