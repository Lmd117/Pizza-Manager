import React, { useEffect, useState } from "react";
import { Button, Flex, 
        Input, Table, 
        TableCell, TableHead, 
        TableRow, TableBody, 
        View, Heading, 
        Alert } from "@aws-amplify/ui-react";

import "@aws-amplify/ui-react/styles.css";

const API_URL = "https://p304ldk4e6.execute-api.us-east-2.amazonaws.com/main";

function ToppingsPage() {
    const [toppings, setToppings] = useState([]);
    const [newTopping, setNewTopping] = useState("");
    const [editingTopping, setEditingTopping] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        fetchToppings()
    }, [])

    // fetch toppings from DB
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
    
        setToppings(data);
      } catch (error) {
        console.error("Error fetching toppings:", error);
        setToppings([]);
        setErrorMessage("Failed to fetch toppings.");
      }
    };

  // Add a new topping
  const addTopping = async() => {
    print("Received request to add topping:", json.dumps(data, indent=2))

    if (!newTopping.trim()) {
      setErrorMessage("Topping name cannot be empty!");
      return;
    }

    if (toppings.includes(newTopping.trim())) {
      setErrorMessage("Duplicate toppings are not allowed!");
      return;
    }

    const requestBody = { name: newTopping.trim() };
    console.log("🔹 Sending POST Request:", requestBody);

    try {
        const response = await fetch(`${API_URL}/toppings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });
  
        if (!response.ok) throw new Error("Failed to add topping");
  
        fetchToppings();
        setNewTopping("");
        setErrorMessage("");
      } catch (error) {
        console.error("Error adding topping:", error);
        setErrorMessage("Error adding topping.");
      }
  };

  // Delete a topping
  const deleteTopping = async (toppingId) => {
    try {
        const response = await fetch(`${API_URL}/toppings`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ toppingId }),
        });
  
        if (!response.ok) throw new Error("Failed to delete topping");
  
        fetchToppings();
      } catch (error) {
        console.error("Error deleting topping:", error);
        setErrorMessage("Error deleting topping.");
      }
  };

  // Update an existing topping
  const updateTopping =async () => {
    if (!newTopping.trim()) {
      setErrorMessage("Topping name cannot be empty!");
      return;
    }
    if (toppings.includes(newTopping.trim())) {
      setErrorMessage("Duplicate toppings are not allowed!");
      return;
    }
    try {
        const response = await fetch(`${API_URL}/toppings`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ toppingId: editingTopping.toppingId, name: newTopping }),
        });
  
        if (!response.ok) throw new Error("Failed to update topping");
  
        fetchToppings();
        setEditingTopping(null);
        setNewTopping("");
        setErrorMessage("");
      } catch (error) {
        console.error("Error updating topping:", error);
        setErrorMessage("Error updating topping.");
      }
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
                <TableRow key={topping.toppingId} backgroundColor="#f9f9f9">
                    <TableCell>{topping.name}</TableCell>
                    <TableCell>
                        <Flex gap="0.5rem">
                            <Button
                            variation="warning"
                            size="small"
                            backgroundColor="#ffcc00"
                            color="black"
                            onClick={() => {
                                setEditingTopping(topping);
                                setNewTopping(topping.name);
                            }}
                            >
                            Edit
                            </Button>
                            <Button 
                                variation="destructive" 
                                size="small" 
                                backgroundColor="#cc0000" 
                                color="white" 
                                onClick={() => deleteTopping(topping.toppingId)}>
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
