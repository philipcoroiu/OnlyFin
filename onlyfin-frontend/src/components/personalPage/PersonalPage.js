import React, {useEffect} from "react"
import Avatar from "../../images/avatar.png"
import Sidebar from "../dashboard/DashboardSidebar"
import axios from "axios";

export default function PersonalPage() {

    const [data, setData] = React.useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/data'); // Replace with your API endpoint
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return(
        <div>
            <Sidebar/>
            <img src={Avatar} width="100px"/>
            <h2>Profile name</h2>
            <p>Welcome! I'm Johannes, a financial analyst specializing in Apple Inc. (AAPL) stock. With expertise in financial statements, market trends, and risk assessment, I provide valuable insights for informed investing. Let's explore the world of finance and unlock the potential of Apple stock together!</p>
            <button>Subscribe</button>
        </div>
    )
}