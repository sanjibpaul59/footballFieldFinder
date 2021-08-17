import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import HomeIcon from "@material-ui/icons/Home";
import Button from "@material-ui/core/Button";
import SportsSoccerOutlinedIcon from "@material-ui/icons/SportsSoccerOutlined";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import PersonAddOutlinedIcon from "@material-ui/icons/PersonAddOutlined";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
import auth from "./../auth/auth-helper";
import { Link, withRouter } from "react-router-dom";

//skeleton function (don't remove)
const isActive = (history, path) => {
  if (history.location.pathname == path) return { color: "#2e7d32" };
  else return { color: "#263238" };
};
const isPartActive = (history, path) => {
  if (history.location.pathname.includes(path))
    return { color: "#2e7d32", backgroundColor: "#eceff1", marginRight: 10 };
  else
    return {
      color: "#263238",
      backgroundColor: "#fafafa",
      marginRight: 10,
    };
};

const flexStyle = {
  flexGrow: 1,
};

const iconStyle = {
  marginRight: 1,
  padding: 2,
  color: "inherit",
  fontSize: "medium",
};
//Don't remove
const Menu = withRouter(({ history }) => (
  <div style={flexStyle}>
    <AppBar
      elevation={0}
      position="static"
      style={{ zIndex: 12343455, backgroundColor: "#fafafa", color: "#212121" }}
    >
      <Toolbar>
        <div style={{ padding: 3 }}>
          <Link to="/">
            <IconButton
              edge="start"
              aria-label="Home"
              style={isActive(history, "/")}
            >
              <HomeIcon />
            </IconButton>
          </Link>
        </div>
        <div style={{ flexGrow: 1 }}>
          <Typography variant="h6" color="inherit">
            Field Finder
          </Typography>
        </div>
        <div style={{ position: "absolute", right: "10px" }}>
          <span style={{ float: "right" }}>
            {!auth.isAuthenticated() && (
              <span>
                <Link to="/fields">
                  <Button style={isActive(history, "/fields")}>Fields</Button>
                </Link>
                <Link to="/signup">
                  <Button style={isActive(history, "/signup")}>Sign up</Button>
                </Link>
                <Link to="/signin">
                  <Button style={isActive(history, "/signin")}>Sign In</Button>
                </Link>
              </span>
            )}
            {auth.isAuthenticated() && (
              <span>
                {auth.isAuthenticated().user.owner && (
                  <span>
                    <Link to="/owner/my-fields">
                      <Button style={isPartActive(history, "/owner/my-fields")}>
                        <SportsSoccerOutlinedIcon style={iconStyle} />
                        My Fields
                      </Button>
                    </Link>
                    <Link to="/owner/addManager">
                      <Button
                        style={isPartActive(history, "/owner/addManager")}
                      >
                        <PersonAddOutlinedIcon style={iconStyle} />
                        Add Manager
                      </Button>
                    </Link>
                  </span>
                )}
                <Link to={"/user/" + auth.isAuthenticated().user._id}>
                  <Button
                    style={isActive(
                      history,
                      "/user/" + auth.isAuthenticated().user._id
                    )}
                  >
                    <AccountCircleOutlinedIcon style={iconStyle} />
                    My Profile
                  </Button>
                </Link>
                <Button
                  color="inherit"
                  onClick={() => {
                    auth.clearJWT(() => history.push("/"));
                  }}
                >
                  Sign out
                </Button>
              </span>
            )}
          </span>
        </div>
      </Toolbar>
    </AppBar>
  </div>
));

export default Menu;
