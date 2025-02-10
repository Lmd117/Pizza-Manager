import React, { useState } from "react";
import { Button, Flex, Input, Table, TableCell, TableHead, TableRow, TableBody, View, Heading, Alert } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

function ToppingsPage() {
  const [toppings, setToppings] = useState(["Cheese", "Pepperoni", "Mushrooms"]);
  const [newTopping, setNewTopping] = useState("");
  const [editingTopping, setEditingTopping] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Add a new topping
  const addTopping = () => {
    if (!newTopping.trim()) {
      setErrorMessage("Topping name cannot be empty!");
      return;
    }
    if (toppings.includes(newTopping.trim())) {
      setErrorMessage("Duplicate toppings are not allowed!");
      return;
    }
    setToppings([...toppings, newTopping.trim()]);
    setNewTopping("");
    setErrorMessage("");
  };

  // Delete a topping
  const deleteTopping = (topping) => {
    setToppings(toppings.filter((t) => t !== topping));
  };

  // Update an existing topping
  const updateTopping = () => {
    if (!newTopping.trim()) {
      setErrorMessage("Topping name cannot be empty!");
      return;
    }
    if (toppings.includes(newTopping.trim())) {
      setErrorMessage("Duplicate toppings are not allowed!");
      return;
    }
    setToppings(toppings.map((t) => (t === editingTopping ? newTopping.trim() : t)));
    setEditingTopping(null);
    setNewTopping("");
    setErrorMessage("");
  };

    return (
        <View
            padding="2rem"
            maxWidth="600px"
            margin="auto"
            backgroundColor="darkgray" // Matches Pizza Page
            borderRadius="10px"
        >
            <Heading level={2} textAlign="center" color="white">
            Manage Pizza Toppings
            </Heading>

            {errorMessage && (
            <Alert variation="error" marginBottom="1rem">
                {errorMessage}
            </Alert>
            )}

            <Flex direction="column" gap="1rem">
            <Input
                placeholder="Enter a topping"
                value={newTopping}
                onChange={(e) => setNewTopping(e.target.value)}
                backgroundColor="white"
                color="black"
            />
            {editingTopping ? (
                <Button variation="primary" backgroundColor="#ff6600" color="white" onClick={updateTopping}>
                Update Topping
                </Button>
            ) : (
                <Button variation="primary" backgroundColor="#0073e6" color="white" onClick={addTopping}>
                Add Topping
                </Button>
            )}
            </Flex>

            <Table variation="striped" marginTop="2rem" backgroundColor="white">
            <TableHead>
                <TableRow>
                <TableCell as="th" backgroundColor="#333" color="white">
                    Topping
                </TableCell>
                <TableCell as="th" backgroundColor="#333" color="white">
                    Actions
                </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {toppings.map((topping) => (
                <TableRow key={topping} backgroundColor="#f9f9f9">
                    <TableCell>{topping}</TableCell>
                    <TableCell>
                    <Flex gap="0.5rem">
                        <Button
                        variation="warning"
                        size="small"
                        backgroundColor="#ffcc00"
                        color="black"
                        onClick={() => {
                            setEditingTopping(topping);
                            setNewTopping(topping);
                        }}
                        >
                        Edit
                        </Button>
                        <Button variation="destructive" size="small" backgroundColor="#cc0000" color="white" onClick={() => deleteTopping(topping)}>
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

export default ToppingsPage;
