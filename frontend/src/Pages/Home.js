import React from "react";
import Sections from "../Components/Nirnay/Sections";
import BannerCards from "../Components/Prateek/BannerCards";
import InstituteGlance from "../Components/Prateek/InstituteGlance";
import PhotoGallery from "../Components/Nirnay/PhotoGallery";
import Footer from "../Components/Prateek/Footer";

function Home() {
  return (
    <div>
      <BannerCards />
      <Sections />
      <PhotoGallery />
      <InstituteGlance />
      <Footer />
    </div>
  );
}

export default Home;
