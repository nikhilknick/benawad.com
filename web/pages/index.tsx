import * as React from "react";

import Layout from "../components/Layout";
import { SearchBar } from "../components/SearchBar";

export default class Home extends React.Component {
  state = {
    query: ""
  };

  render() {
    return (
      <Layout>
        <SearchBar />
      </Layout>
    );
  }
}
