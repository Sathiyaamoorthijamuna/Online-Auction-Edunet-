export const createAuction = async (formData, token) => {
    try {
      const response = await fetch("http://localhost:5000/api/auctions/create", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`, 
        },
        body: formData, 
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create auction");
      }
  
      return await response.json();
    } catch (error) {
      console.error("Auction API error:", error.message);
      return { error: error.message };
    }
  };
  