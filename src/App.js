import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import "./App.css";
import { useEffect, useReducer, useRef } from "react";

function reducer(state, action) {
  switch (action.type) {
    case "fetchingData": {
      return {
        ...state,
        status: "loadingData",
      };
    }

    case "dataFetched": {
      return { ...state, status: "dataLoaded", data: action.payload };
    }

    case "error": {
      return { ...state, status: "error" };
    }

    case "setQuery": {
      return { ...state, query: action.payload };
    }

    case "noResults": {
      return { ...state, status: "noResults" };
    }

    default:
      console.log("Working.");
  }
}

export default function App() {
  const triggerEffect = useRef(false);
  const [state, dispatch] = useReducer(reducer, {
    status: "appLoaded",
    query: "",
    data: {},
  });

  useEffect(() => {
    if (triggerEffect.current) {
      async function fetchData() {
        try {
          dispatch({ type: "fetchingData" });
          const req = await fetch(
            `https://api.api-ninjas.com/v1/cocktail?name=${state.query}`,
            {
              headers: {
                "X-Api-Key": "epM7i7XJzbQKGAluAgECow==2VC0rmqrQMgOobod",
              },
            }
          );

          const data = await req.json();
          dispatch({ type: "dataFetched", payload: data });
          if (data.length === 0) {
            dispatch({ type: "noResults" });
          }
        } catch (err) {
          console.log(err);
        }
      }
      fetchData();
    } else {
      triggerEffect.current = true;
      return;
    }
  }, [state.query]);

  function handleSetValue(e) {
    e.preventDefault();
    const inputValue = e.target[0].value;
    if (!inputValue) {
      return;
    }
    dispatch({ type: "setQuery", payload: inputValue });
  }

  return (
    <Container className="p-5">
      <Row>
        <Col className="">
          <h1 className="mt-5 mb-2 sedgwick-ave-display-regular">
            Cocktail House
          </h1>
          <h3 className="indie-flower-regular mb-5">
            Find the recipe for your favourite cocktail!
          </h3>
          <Form onSubmit={(e) => handleSetValue(e)}>
            <Form.Group className="mb-3">
              <Form.Control
                className="p-3 indie-flower-regular mb-5"
                type="text"
                placeholder="Enter the name of cocktail..."
              />
            </Form.Group>
            <Button
              new="true"
              className="btn-minimal pt-2 pb-2 p-4 indie-flower-regular"
              variant="dark"
              type="submit"
            >
              Search
            </Button>
          </Form>
        </Col>
      </Row>

      <Row className="mt-5 d-flex flex-column">
        {state.status === "loadingData" && (
          <Col className="d-flex flex-direction-column justify-content-center">
            <div className="loader"></div>
          </Col>
        )}
        {state.status === "noResults" && (
          <Col className="d-flex flex-direction-column justify-content-center">
            <p className="text-custom mt-5">No results found.</p>
          </Col>
        )}

        {state.status === "dataLoaded" &&
          state.data.map((item) => (
            <Col className="d-flex flex-direction-column justify-content-center">
              <Card style={{ width: "30rem", height: "100%" }}>
                <Card.Body>
                  <Card.Title className="mb-3" style={{ fontSize: "30px" }}>
                    {item.name}
                  </Card.Title>
                  <Card.Text>{item.instructions}</Card.Text>
                </Card.Body>
                <ListGroup className="list-group-flush">
                  {item.ingredients.map((ingredient) => (
                    <ListGroup.Item>{ingredient}</ListGroup.Item>
                  ))}
                </ListGroup>
              </Card>
            </Col>
          ))}
      </Row>
    </Container>
  );
}
