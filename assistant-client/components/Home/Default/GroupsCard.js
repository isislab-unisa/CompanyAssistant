import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { getGroups } from "../../../controllers/groupController";
import { getUserRole } from "../../../controllers/userController";

// project imports
import MainCard from "../../ui-component/cards/MainCard";
import SkeletonPopularCard from "../../ui-component/cards/Skeleton/PopularCard";

import { gridSpacing } from "../../../store/constant";

// assets
import {
  Avatar,
  Button,
  CardActions,
  CardContent,
  Divider,
  Grid,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import { makeStyles } from "@material-ui/styles";
// ==============================|| DASHBOARD DEFAULT - POPULAR CARD ||============================== //

const useStyles = makeStyles((theme) => ({
  cardAction: {
    padding: "10px",
    paddingTop: 0,
    justifyContent: "center",
  },
  primaryLight: {
    color: theme.palette.primary[200],
    cursor: "pointer",
  },
  divider: {
    marginTop: "12px",
    marginBottom: "12px",
  },
  avatarSuccess: {
    width: "16px",
    height: "16px",
    borderRadius: "5px",
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.dark,
    marginLeft: "15px",
  },
  successDark: {
    color: theme.palette.success.dark,
  },
  avatarError: {
    width: "16px",
    height: "16px",
    borderRadius: "5px",
    backgroundColor: theme.palette.orange.light,
    color: theme.palette.orange.dark,
    marginLeft: "15px",
  },
  errorDark: {
    color: theme.palette.orange.dark,
  },
}));

const GroupsCard = () => {
  const [isLoading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [policies, setPolicies] = useState([]);

  useEffect(() => {
    if (!isLoading) return;
    getGroups((result, error) => {
      if (error != null) {
        alert(error);
      } else {
        console.log(result);
        setGroups(result);
        setLoading(false);
      }
    });
    getUserRole((res, err) => {
      if (err != null) alert(err);
      else setPolicies(res);
    });
  }, [isLoading]);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {isLoading ? (
        <SkeletonPopularCard />
      ) : (
        <MainCard content={false}>
          <CardContent>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <Grid
                  container
                  alignContent="center"
                  justifyContent="space-between"
                >
                  <Grid item>
                    <Typography variant="h4">My Groups</Typography>
                  </Grid>
                  <Grid item>
                    <MoreHorizOutlinedIcon
                      fontSize="small"
                      sx={{
                        cursor: "pointer",
                      }}
                      aria-controls="menu-popular-card"
                      aria-haspopup="true"
                      onClick={handleClick}
                    />
                    <Menu
                      id="menu-popular-card"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                      variant="selectedMenu"
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                    >
                      <MenuItem onClick={handleClose}> Today</MenuItem>
                      <MenuItem onClick={handleClose}> This Month</MenuItem>
                      <MenuItem onClick={handleClose}> This Year </MenuItem>
                    </Menu>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sx={{ pt: "16px !important" }}></Grid>
              {groups.slice(0, 4).map((item, index) => (
                <Grid item xs={12}>
                  <Grid container direction="column">
                    <Grid item>
                      <Grid
                        container
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Grid item>
                          <Typography variant="subtitle1" color="inherit">
                            {item.name}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Grid
                            container
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <Grid item>
                              <Typography
                                variant="subtitle1"
                                color="inherit"
                              ></Typography>
                            </Grid>
                            <Grid item>
                              <Avatar
                                variant="rounded"
                                sx={{
                                  width: 16,
                                  height: 16,
                                  borderRadius: "5px",
                                  ml: 2,
                                }}
                              >
                                <KeyboardArrowRightOutlinedIcon
                                  fontSize="small"
                                  color="inherit"
                                />
                              </Avatar>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "success.dark" }}
                      ></Typography>
                    </Grid>
                  </Grid>
                  <Divider sx={{ my: 1.5 }} />
                </Grid>
              ))}
            </Grid>
          </CardContent>
          <CardActions sx={{ p: 1.25, pt: 0, justifyContent: "center" }}>
            <Button
              onClick={() => (window.location.href = "./groups")}
              size="small"
              disableElevation
            >
              View All
              <ChevronRightOutlinedIcon />
            </Button>
          </CardActions>
        </MainCard>
      )}
    </>
  );
};

GroupsCard.propTypes = {
  isLoading: PropTypes.bool,
};

export default GroupsCard;
