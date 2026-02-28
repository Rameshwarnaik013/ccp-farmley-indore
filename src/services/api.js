const API_URL = "https://script.google.com/macros/s/AKfycbzO3IZpqqcmYxAHohUJike7IjE1xlV4bhKnzXw_nvaTShdYC91BsdIW53XTOD848EXd/exec";

export const fetchCCPData = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();

        // Normalize data
        if (result.data && Array.isArray(result.data)) {
            result.data = result.data.map(item => {
                let formattedDate = item.Date;
                let formattedTime = item.Time;

                // Handle Date
                if (item.Date) {
                    try {
                        // Extract YYYY-MM-DD from ISO string or Date object
                        const dateObj = new Date(item.Date);
                        if (!isNaN(dateObj.getTime())) {
                            formattedDate = dateObj.toISOString().split('T')[0];
                        }
                    } catch (e) {
                        console.warn('Date parsing error', e);
                    }
                }

                // Handle Time
                if (item.Time) {
                    try {
                        const dateObj = new Date(item.Time);
                        if (!isNaN(dateObj.getTime())) {
                            // Extract HH:mm from ISO string
                            formattedTime = dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
                        }
                    } catch (e) {
                        console.warn('Time parsing error', e);
                    }
                }

                return {
                    ...item,
                    Date: formattedDate,
                    Time: formattedTime
                };
            });
        }

        return result;
    } catch (error) {
        console.error("Error fetching CCP data:", error);
        // Fallback to empty structure or rethrow depending on needs
        return { status: "error", message: error.message, data: [] };
    }
};
