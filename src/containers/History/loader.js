import React, { Component } from "react";
import ContentLoader from "react-content-loader"

export default class Com extends Component {
   render() {
       return (<ContentLoader
        height={160}
        width={400}
        speed={2}
        primaryColor="#f3f3f3"
        secondaryColor="#ecebeb"
    >
        <rect x="108" y="7.24" rx="3" ry="3" width="196" height="11.58" />
        <rect x="4.89" y="3.61" rx="0" ry="0" width="89.7" height="63.27" />
        <rect x="28.89" y="22.61" rx="0" ry="0" width="0" height="0" />
    </ContentLoader>);
   }
}