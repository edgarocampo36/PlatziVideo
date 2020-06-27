import React from "react";
import { connect } from "react-redux";
import Search from "../components/Search";
import Categories from "../components/Categories";
import Carousel from "../components/Carousel";
import CarouselItem from "../components/CarouselItem";

import "../assets/styles/App.scss";
import Header from "../components/Header";

const Home = ({ myList, trends, originals, mySearch }) => {
  return (
    <>
      <Header setColor="morado" />
      <Search isHome />

      {mySearch.length > 0 && (
        <Categories title="Resultados de la búsqueda">
          <Carousel>
            {mySearch.map((item) => {
              return <CarouselItem key={item.id} {...item} />;
            })}
          </Carousel>
        </Categories>
      )}

      {myList.length > 0 && (
        <Categories title="Mi lista">
          <Carousel>
            {myList.map((item) => {
              return <CarouselItem key={item.id} {...item} isList />;
            })}
          </Carousel>
        </Categories>
      )}

      <Categories title="Tendencias">
        <Carousel>
          {trends.map((item) => {
            return <CarouselItem key={item.id} {...item} />;
          })}
        </Carousel>
      </Categories>

      <Categories title="Originales de PlatziVideo">
        <Carousel>
          {originals.map((item) => {
            return <CarouselItem key={item.id} {...item} />;
          })}
        </Carousel>
      </Categories>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    myList: state.myList,
    trends: state.trends,
    originals: state.originals,
    mySearch: state.mySearch,
  };
};

export default connect(mapStateToProps, null)(Home);
