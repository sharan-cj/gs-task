import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useProductsStore } from "../store";
import { Card } from "../components";
import { TProduct } from "../utils/types";

export const Home = () => {
  const [limit, setLimit] = useState(10);
  const products = useProductsStore((state) => state.products);
  const fetchProducts = useProductsStore((state) => state.fetch);
  const ranking = useProductsStore((state) => state.productRanking);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await fetchProducts(limit);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [limit]);

  const sortedProducts = useMemo(() => {
    const length = products.length;
    const prodArr: TProduct[] = [];
    const notRanked: TProduct[] = [];
    for (let i = 0; i < length; i++) {
      if (ranking[products[i].id]) {
        prodArr[ranking[products[i].id] - 1] = products[i];
      } else {
        notRanked.push(products[i]);
      }
    }

    for (let i = 0; i < length; i++) {
      if (!prodArr[i]) {
        const item = notRanked.shift();
        if (item) {
          prodArr[i] = item;
        }
      }
    }

    return prodArr;
  }, [products, ranking]);

  useEffect(() => {
    const handleScroll = () => {
      if (loading) return;
      if (
        Math.round(window.innerHeight + document.documentElement.scrollTop) ===
        document.documentElement.offsetHeight
      ) {
        setLimit((prev) => prev + 10);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [window.innerHeight]);

  return (
    <Container>
      {sortedProducts.map((product, index) => (
        <Card key={product.id} cardInfo={product} index={index + 1} />
      ))}

      {loading && <Loading>Loading...</Loading>}
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  background: #fff;
  padding: 1rem;
  border-radius: 0.5rem;
  margin: auto;
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
`;

const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
