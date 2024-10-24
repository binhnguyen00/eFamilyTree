import React from "react";
import {
  Avatar,
  List,
  Text,
  Box,
  Page,
  useNavigate,
} from "zmp-ui";
import { useRecoilValue } from "recoil";
import { displayNameState, userState } from "state";

export function UIDummyUserForm() {
  const { userInfo: user } = useRecoilValue(userState);
  const displayName = useRecoilValue(displayNameState);
  return (
    <Page className="page">
      <Box
        flex
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Box>
          <Avatar
            story="default"
            size={96}
            online
            src={user.avatar.startsWith("http") ? user.avatar : undefined}
          >
            {user.avatar}
          </Avatar>
        </Box>
        <Box flex flexDirection="row" alignItems="center" ml={8}>
          <Box>
            <Text.Title>{displayName || user.name}</Text.Title>
          </Box>
          <Box ml={4}>
          </Box>
        </Box>
      </Box>
      <Box m={0} p={0} mt={4}>
        <div className="section-container">
          <List>
            <List.Item title="Name" subTitle={user.name} />
            <List.Item title="Display Name" subTitle={displayName} />
            <List.Item title="ID" subTitle={user.id} />
          </List>
        </div>
      </Box>
    </Page>
  );
};

export function UIDummyUser() {
  const navigate = useNavigate();
  const { userInfo: user } = useRecoilValue(userState);

  return (
    <div className="section-container flex-h clickable" onClick={() => navigate("/user")}>
      <Avatar src={user.avatar.startsWith("http") ? user.avatar : undefined}>
        {user.avatar}
      </Avatar>
      <Text bold>
        {"Trịnh Trọng Đức"}
      </Text>
    </div>
  );
}