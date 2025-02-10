import React, { useState } from "react";
import { Button, Flex, Input, Table, TableCell, TableHead, TableRow, TableBody, View, Heading, Alert, Badge } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

function PizzaPage() {
  const [pizzas, setPizzas] = useState([
    { name: "Margherita", toppings: ["Cheese", "Tomato"] },
    { name: "Pepperoni", toppings: ["Cheese", "Pepperoni"] },
  ]);

  const [toppings] = useState(["Cheese", "Tomato", "Pepperoni", "Mushrooms", "Olives", "Onions"]);
  const [newPizzaName, setNewPizzaName] = useState("");
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [editingPizza, setEditingPizza] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Add a new pizza
  const addPizza = () => {
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

    setPizzas([...pizzas, { name: newPizzaName.trim(), toppings: selectedToppings }]);
    resetForm();
  };

  // Delete a pizza
  const deletePizza = (pizzaName) => {
    setPizzas(pizzas.filter((pizza) => pizza.name !== pizzaName));
  };

  // Update an existing pizza
  const updatePizza = () => {
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

    setPizzas(
      pizzas.map((pizza) =>
        pizza.name === editingPizza.name
          ? { ...pizza, name: newPizzaName.trim(), toppings: selectedToppings }
          : pizza
      )
    );
    resetForm();
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
            backgroundColor="white" // Makes input visible
            color="black"
            />
    
            <Heading level={5} color="white">
            Select Toppings:
            </Heading>
            <Flex wrap="wrap" gap="0.5rem">
            {toppings.map((topping) => (
                <Button
                key={topping}
                variation={selectedToppings.includes(topping) ? "primary" : "secondary"}
                size="small"
                backgroundColor={selectedToppings.includes(topping) ? "#ff6600" : "#555"} // Orange for selected, grey for unselected
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