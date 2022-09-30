import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";

import { getVmsInUse } from "../../../controllers/vmController";
import MainCard from "../../ui-component/cards/MainCard";
import TotalIncomeCard from "../../ui-component/cards/Skeleton/TotalIncomeCard";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  content: {
    padding: "16px !important",
  },
  card: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.light,
    overflow: "hidden",
    position: "relative",
    "&:after": {
      content: '""',
      position: "absolute",
      width: 210,
      height: 210,
      background: `linear-gradient(210.04deg, ${theme.palette.primary[200]} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
      borderRadius: "50%",
      top: -30,
      right: -180,
    },
    "&:before": {
      content: '""',
      position: "absolute",
      width: 210,
      height: 210,
      background: `linear-gradient(140.9deg, ${theme.palette.primary[200]} -14.02%, rgba(144, 202, 249, 0) 77.58%)`,
      borderRadius: "50%",
      top: -160,
      right: -130,
    },
  },
}));

const StartedVms = () => {
  const theme = useStyles();

  const [isLoading, setLoading] = useState(true);
  const [vms, setVms] = useState([]);

  useEffect(() => {
    if (!isLoading) return;
    setLoading(true);
    getVmsInUse((result, error) => {
      if (error != null) {
        alert(error);
      } else {
        console.log(result);
        setVms(result);
        setLoading(false);
      }
    });
  }, [isLoading]);

  return (
    <>
      {isLoading ? (
        <TotalIncomeCard />
      ) : (
        <MainCard
          border={true}
          className={theme.card}
          contentClass={theme.content}
          content={false}
        >
          <Box sx={{ p: 2 }}>
            <List sx={{ py: 0 }}>
              <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                <ListItemAvatar></ListItemAvatar>
                <ListItemText
                  sx={{
                    py: 0,
                    mt: 0.45,
                    mb: 0.45,
                  }}
                  primary={
                    <Typography variant="h4" sx={{ color: "#fff" }}>
                      {vms.length}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "primary.light", mt: 0.25 }}
                    >
                      Virtual Machine Started
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </Box>
        </MainCard>
      )}
    </>
  );
};

StartedVms.propTypes = {
  isLoading: PropTypes.bool,
};

export default StartedVms;
