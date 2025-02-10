import React, { useState, useEffect } from "react"
import { Button, Flex, 
        Input, Table, 
        TableCell, TableHead, 
        TableRow, TableBody, 
        View, Heading, 
        Alert, Badge } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

const API_URL = "https://your-api-gateway-url"

function PizzaPage() {
  const [pizzas, setPizzas] = useState([]);
  const [newPizzaName, setNewPizzaName] = useState("");
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [editingPizza, setEditingPizza] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    fetchPizzas();
  }, []);

  // fetch pizzas from DB
  const fetchPizzas = async() => {
    try {
      const response = await fetch(`${API_URL}/pizzas`);
      const data = await response.json();
      setPizzas(data);
    } catch (error) {
      console.error("Error fetching pizzas:", error);
      setErrorMessage("Failed to fetch pizzas.");
    }
  }

  // Add a new pizza
  const addPizza = async() => {
    if (!newPizzaName.trim()) {
      setErrorMessage("Pizza name cannot be empty!");
      return;
    }
    if (pizzas.some((pizza) => pizza.name.toLowerCase() === newPizzaName.trim().toLowerCase())) {
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

      if (!response.ok) throw new Error("Failed to add pizza");
      
      fetchPizzas();
      resetForm();
    } catch (error) {
      console.error("Error creating pizza:", error);
      setErrorMessage("Error creating pizza.");
    }
  };

  // Delete a pizza
  const deletePizza = async (pizzaId) => {
    try {
      const response = await fetch(`${API_URL}/pizzas`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pizzaId }),
      });

      if (!response.ok) throw new Error("Failed to delete pizza");
      
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
      pizzas.some((pizza) => pizza.name.toLowerCase() === newPizzaName.trim().toLowerCase()) &&
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
        body: JSON.stringify({ pizzaId: editingPizza.pizzaId, name: newPizzaName, toppings: selectedToppings }),
      });

      if (!response.ok) throw new Error("Failed to update pizza");
      
      fetchPizzas();
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
          backgroundColor="darkgray" // Ensures proper contrast
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
              {["Cheese", "Tomato", "Pepperoni", "Mushrooms", "Olives", "Onions"].map((topping) => (
                <Button
                  key={topping}
                  variation={selectedToppings.includes(topping) ? "primary" : "secondary"}
                  size="small"
                  backgroundColor={selectedToppings.includes(topping) ? "#ff6600" : "#555"}
                  color="white"
                  onClick={() => toggleTopping(topping)}
                >
                  {topping}
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
                        {topping}
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
                        setEditingPizza(pizza);
                        setNewPizzaName(pizza.name);
                        setSelectedToppings(pizza.toppings);
                        }}
                    >
                        Edit
                    </Button>
                    <Button variation="destructive" size="small" backgroundColor="#cc0000" color="white" onClick={() => deletePizza(pizza.name)}>
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