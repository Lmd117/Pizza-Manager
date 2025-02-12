import React, { useState, useEffect } from "react"
import { Button, Flex, 
        Input, Table, 
        TableCell, TableHead, 
        TableRow, TableBody, 
        View, Heading, 
        Alert, Badge } from "@aws-amplify/ui-react";

import "@aws-amplify/ui-react/styles.css";

const API_URL = "https://p304ldk4e6.execute-api.us-east-2.amazonaws.com/main"

function PizzaPage() {
  const [pizzas, setPizzas] = useState([]);
  const [toppings, setToppings] = useState([]);
  const [newPizzaName, setNewPizzaName] = useState("");
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [editingPizza, setEditingPizza] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    fetchPizzas();
    fetchToppings();
  }, []);

  // fetch pizzas from DB
  const fetchPizzas = async() => {
    try {
      const response = await fetch(`${API_URL}/pizzas`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      console.log("🍕 API Response for Pizzas:", JSON.stringify(data, null, 2));

      if (!data.items || !Array.isArray(data.items)) {
        console.error("API returned invalid data:", data);
        setPizzas([]);
        return;
      }

      setPizzas(data.items);

    } catch (error) {
      console.error("Error fetching pizzas:", error);
      setPizzas([]);
      setErrorMessage("Failed to fetch pizzas.");
    }
  }

  // Fetch toppings from DB
  const fetchToppings = async () => {
    try {
      const response = await fetch(`${API_URL}/toppings`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (!data.items || !Array.isArray(data.items)) {
        console.error("API returned invalid data:", data);
        setToppings([]);
        return;
      }
  
      setToppings(data.items);
    } catch (error) {
      console.error("Error fetching toppings:", error);
      setToppings([]);
      setErrorMessage("Failed to fetch toppings.");
    }
  };

  // Add a new pizza
  const addPizza = async() => {

    if (!newPizzaName.trim()) {
      setErrorMessage("Pizza name cannot be empty!");
      return;
    }

    if (pizzas.includes(newPizzaName.trim())) {
      setErrorMessage("Duplicate pizzas are not allowed!");
      return;
    }

    if (selectedToppings.length === 0) {
      setErrorMessage("A pizza must have at least one topping!");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/pizzas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newPizzaName, toppings: selectedToppings }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText)
        throw new Error("Failed to add pizza");
      }
      
      fetchPizzas();
      resetForm();
    } catch (error) {
      console.error("Error creating pizza:", error);
      setErrorMessage("Error creating pizza.");
    }
  };

  // Delete a pizza
  const deletePizza = async (id) => {
    if (!id) {
      console.error("Invalid Pizza ID:", id);
      return;
    }

    try {
      console.log(`Deleting Pizza: ${id}`);
      const response = await fetch(`${API_URL}/pizzas`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error("Failed to delete pizza");
      }

      console.log("Pizza Deleted Successfully");
      fetchPizzas(); 
    } catch (error) {
        console.error("Error deleting pizza:", error);
        setErrorMessage("Error deleting pizza.");
    }
};


  // Update an existing pizza
  const updatePizza = async() => {

    if (!newPizzaName.trim()) {
      setErrorMessage("Pizza name cannot be empty!");
      return;
    }

    if (
      pizzas.includes(newPizzaName.trim()) &&
      newPizzaName !== editingPizza.name
    ) {
      setErrorMessage("Duplicate pizzas are not allowed!");
      return;
    }

    if (selectedToppings.length === 0) {
      setErrorMessage("A pizza must have at least one topping!");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/pizzas`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingPizza.id, name: newPizzaName, toppings: selectedToppings }),
      });

      if (!response.ok) {
        const errorText = await response.text(); 
        console.error("API Error Response:", errorText);
        throw new Error(`Failed to update pizza: ${errorText}`);
      }
      
      fetchPizzas();
      setEditingPizza(null);
      resetForm();
    } catch (error) {
      console.error("Error updating pizza:", error);
      setErrorMessage("Error updating pizza.");
    }
  };

  // Reset form fields
  const resetForm = () => {
    setNewPizzaName("");
    setSelectedToppings([]);
    setEditingPizza(null);
    setErrorMessage("");
  };

  // Handle topping selection
  const toggleTopping = (topping) => {
    setSelectedToppings((prev) =>
      prev.includes(topping) ? prev.filter((t) => t !== topping) : [...prev, topping]
    );
  };

    return (
        <View
          padding="2rem"
          maxWidth="700px"
          margin="auto"
          backgroundColor="darkgray"
          borderRadius="10px"
        >
        <Heading level={2} margin={"1rem"} textAlign="center" color="white">
            Manage Pizzas 🍕
        </Heading>
    
        {errorMessage && (
            <Alert variation="error" marginBottom="1rem">
            {errorMessage}
            </Alert>
        )}
    
        <Flex direction="column" gap="1rem">
            <Input
              placeholder="Enter pizza name"
              value={newPizzaName}
              onChange={(e) => setNewPizzaName(e.target.value)}
              backgroundColor="white"
              color="black"
            />
    
            <Heading level={5} color="white">
              Select Toppings:
            </Heading>
            <Flex wrap="wrap" gap="0.5rem">
              {toppings.map((topping) => (
                <Button
                  key={topping.id}
                  variation={selectedToppings.includes(topping.name) ? "primary" : "secondary"}
                  size="small"
                  backgroundColor={selectedToppings.includes(topping.name) ? "#ff6600" : "#555"}
                  color="white"
                  onClick={() => toggleTopping(topping.name)}
                >
                  {topping.name}
                </Button>
              ))}
            </Flex>
    
            {editingPizza ? (
            <Button variation="primary" backgroundColor="#ff6600" color="white" onClick={updatePizza}>
                Update Pizza
            </Button>
            ) : (
            <Button variation="primary" backgroundColor="#0073e6" color="white" onClick={addPizza}>
                Add Pizza
            </Button>
            )}
        </Flex>
    
        <Table variation="striped" marginTop="2rem" backgroundColor="white">
            <TableHead>
            <TableRow>
                <TableCell as="th" backgroundColor="#333" color="white">
                  Pizza Name
                </TableCell>
                <TableCell as="th" backgroundColor="#333" color="white">
                  Toppings
                </TableCell>
                <TableCell as="th" backgroundColor="#333" color="white">
                  Actions
                </TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
              {pizzas.map((pizza) => (
                <TableRow key={pizza.name} backgroundColor="#f9f9f9">
                  <TableCell>{pizza.name}</TableCell>
                  <TableCell>
                      <Flex gap="0.5rem">
                      {pizza.toppings.map((topping) => (
                          <Badge key={topping} variation="success">
                            {topping.name}
                          </Badge>
                      ))}
                      </Flex>
                  </TableCell>
                  <TableCell>
                      <Flex gap="0.5rem">
                      <Button
                          variation="warning"
                          size="small"
                          backgroundColor="#ffcc00"
                          color="black"
                          onClick={() => {
                            setEditingPizza({ id: pizza.id, name: pizza.name});
                            setNewPizzaName(pizza.name);
                            setSelectedToppings(pizza.toppings.map(t => t.name));
                          }}
                      >
                          Edit
                      </Button>
                      <Button variation="destructive" size="small" backgroundColor="#cc0000" color="white" onClick={() => deletePizza(pizza.id)}>
                          Delete
                      </Button>
                      </Flex>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
        </Table>
        </View>
    );
}
export default PizzaPage  