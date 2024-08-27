import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import "./App.css";
import { useEffect, useRef, useState } from "react";

export default function App() {
  const [value, setValue] = useState("");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const triggerEffect = useRef(false);

  useEffect(() => {
    if (triggerEffect.current) {
      async function fetchData() {
        setLoading(true);
        const req = await fetch(
          `https://api.api-ninjas.com/v1/cocktail?name=${value}`,
          {
            headers: {
              "X-Api-Key": "epM7i7XJzbQKGAluAgECow==2VC0rmqrQMgOobod",
            },
          }
        );

        const res = await req.json();
        setData(res);
        setLoading(false);
      }
      fetchData();
    } else {
      triggerEffect.current = true;
      return;
    }
  }, [value]);

  function handleSetValue(e) {
    e.preventDefault();
    const inputValue = e.target[0].value;
    if (!inputValue) {
      return;
    }
    setValue(e.target[0].value);
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
              Submit
            </Button>
          </Form>
        </Col>
      </Row>

      {data.length > 0 ? (
        data.map((item) => (
          <Row className="mt-5">
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
          </Row>
        ))
      ) : (
        <p className="text-custom mt-5">No results found.</p>
      )}
    </Container>
  );
}
