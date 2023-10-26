import "./App.css";
import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import axios, * as others from "axios";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { BarChart } from "@mui/x-charts/BarChart";
import DynamicTable from "./Table";

function App() {
  const [selectedVendor, setSelectedVendor] = React.useState("");
  const [optionsVendor, setOptionsVendor] = React.useState([]);
  const [sales, setSales] = React.useState([]);

  React.useEffect(() => {
    const fetchVendors = async () => {
      axios.get("/api/vendors").then(
        (response) => {
          console.log(response);
          if (response.status === 200) {
            setOptionsVendor(response.data);
            console.log(response.data);
          } else {
            console.log(`Status code ${response.status}`);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    };
    fetchVendors();
  }, []);
  const fetchMonthlySales = async (data) => {
    axios.get(`/api/monthlysales/${data}`).then(
      (response) => {
        console.log(response);
        if (response.status === 200) {
          response.data.sort((a, b) => {
            return a._id - b._id;
          });
          setSales(response.data);
        } else {
          console.log(`Status code ${response.status}`);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7}>
        <Paper sx={{ width: "97%", overflow: "hidden", my: 2 }}>
          <Box>
            <BarChart
              xAxis={[
                {
                  id: "barCategories",
                  data: months,
                  scaleType: "band",
                  label: "Number of monthly sales made by the vendor",
                },
              ]}
              series={
                sales.length > 0 && sales[0].hasOwnProperty("numberOfSales")
                  ? [
                      {
                        data: sales.map((item) => item.numberOfSales),
                      },
                    ]
                  : [
                      {
                        data: Array(12).fill(0),
                      },
                    ]
              }
              height={300}
            />
          </Box>
        </Paper>
        <DynamicTable vendor={selectedVendor} />
      </Grid>
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}></Avatar>
          <Box component="form" sx={{ mt: 20 }}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={optionsVendor.map((item) => item.name)}
              sx={{ width: 300, padding: 3 }}
              renderInput={(params) => (
                <TextField {...params} label="Vendor name" />
              )}
              onChange={(event, value) => {
                console.log(value);
                setSelectedVendor(value);
                fetchMonthlySales(value);
              }}
            />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default App;
