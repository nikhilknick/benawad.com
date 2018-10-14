import * as React from "react";
import debounce from "lodash.debounce";
import Downshift from "downshift";
import { Query } from "react-apollo";
import { gql } from "apollo-boost";

import { SearchQuery, SearchQueryVariables } from "../lib/schema-types";
import SearchIcon from "./SearchIcon";

const searchQuery = gql`
  query SearchQuery($query: String!) {
    search(query: $query) {
      id
      title
      thumbnail
    }
  }
`;

interface State {
  query: string;
}

export class SearchBar extends React.PureComponent<{}, State> {
  state = {
    query: ""
  };

  onStateChange = debounce(
    ({ inputValue }) => {
      if (typeof inputValue !== "undefined") {
        this.setState({ query: inputValue });
      }
    },
    500,
    { maxWait: 500 }
  );

  componentWillUnmount() {
    this.onStateChange.cancel();
  }

  render() {
    return (
      <Downshift
        onStateChange={this.onStateChange}
        id="autocomplete"
        labelId="autocomplete-label"
        inputId="autocomplete-input"
        menuId="autocomplete-menu"
        itemToString={x => (x ? x.title : "")}
        onChange={item =>
          (window.location.href = `https://www.youtube.com/watch?v=${item.id}`)
        }
        isOpen
      >
        {({
          getInputProps,
          getItemProps,
          selectedItem,
          highlightedIndex,
          isOpen
        }) => (
          <div style={{ marginTop: 60 }}>
            <div
              style={{
                boxShadow:
                  "0 0 0 1px rgba(49,49,93,.03), 0 2px 5px 0 rgba(49,49,93,.1), 0 1px 2px 0 rgba(0,0,0,.08)",
                borderRadius: 4,
                padding: 10,
                backgroundColor: "#fff",
                display: "flex",
                alignItems: "center"
              }}
            >
              <SearchIcon />
              <input
                {...getInputProps({
                  style: {
                    flex: 1,
                    marginLeft: 10,
                    width: "100%",
                    borderStyle: "none",
                    backgroundColor: "transparent",
                    outline: "none",
                    color: "#555d77",
                    fontSize: 28
                  },
                  placeholder: "Search..."
                })}
              />
            </div>
            {isOpen ? (
              <div
                style={{
                  backgroundColor: "#e6e6e6",
                  boxShadow:
                    "rgba(0, 0, 0, 0.2) 0px 1px 3px 0px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 2px 1px -1px",
                  fontFamily: "Oswald"
                }}
              >
                <Query<SearchQuery, SearchQueryVariables>
                  query={searchQuery}
                  variables={this.state}
                  skip={!this.state.query}
                >
                  {({ data, loading }) => {
                    if (
                      data &&
                      data.search &&
                      !data.search.length &&
                      !loading
                    ) {
                      return (
                        <div style={{ padding: 20, fontSize: 24 }}>
                          no results
                        </div>
                      );
                    }

                    return data && data.search
                      ? data.search.map((item, index) => (
                          <div
                            {...getItemProps({
                              item,
                              index,
                              key: item.title,
                              style: {
                                backgroundColor:
                                  highlightedIndex === index
                                    ? "#d9d9d9"
                                    : undefined,
                                fontWeight:
                                  selectedItem === item ? "bold" : "normal",
                                display: "flex",
                                padding: 20
                              }
                            })}
                          >
                            <img
                              style={{
                                width: 160,
                                height: 90,
                                marginRight: 20
                              }}
                              src={item.thumbnail!}
                            />
                            <div style={{ fontSize: 24 }}>{item.title}</div>
                          </div>
                        ))
                      : null;
                  }}
                </Query>
              </div>
            ) : null}
          </div>
        )}
      </Downshift>
    );
  }
}
