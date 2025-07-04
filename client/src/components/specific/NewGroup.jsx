import { useInputValidation } from "6pp";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import {
  useAvailableFriendsQuery,
  useNewGroupMutation,
} from "../../redux/api/api";
import { setIsNewGroup } from "../../redux/reducers/misc";
import UserItem from "../shared/UserItem";

const NewGroup = () => {
  const dispatch = useDispatch();
  const { isNewGroup } = useSelector((store) => store.misc);

  const { isError, isLoading, error, data } = useAvailableFriendsQuery();
  const [newGroup, isLoadingNewGroup] = useAsyncMutation(useNewGroupMutation);

  const groupName = useInputValidation("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((curr) => curr !== id) : [...prev, id]
    );
  };

  const submitHandler = async () => {
    if (!groupName.value) return toast.error("Group name is required");

    if (selectedMembers.length < 2)
      return toast.error("Please select at least 2 more members");

    await newGroup("Creating group...", {
      name: groupName.value,
      members: selectedMembers,
    });

    closeHandler();
  };

  const closeHandler = () => dispatch(setIsNewGroup(false));

  const errors = [{ isError, error }];
  useErrors(errors);

  return (
    <Dialog open={isNewGroup} onClose={closeHandler}>
      <Stack width={{ xs: "80vw", sm: "25rem" }} spacing={"0.5rem"}>
        <DialogTitle textAlign={"center"}>Create New Group</DialogTitle>
        <Box sx={{ width: "100%" }} p={"0.5rem"}>
          <TextField
            color="primary"
            fullWidth
            label="Group Name"
            size="small"
            value={groupName.value}
            onChange={groupName.changeHandler}
          />
        </Box>
        <Typography paddingLeft={"1rem"}>Add Members</Typography>
        <Stack>
          {isLoading ? (
            <Skeleton />
          ) : (
            data?.friends?.map((user) => (
              <UserItem
                user={user}
                key={user._id}
                handler={selectMemberHandler}
                isAdded={selectedMembers.includes(user._id)}
              />
            ))
          )}
        </Stack>
        <Stack
          direction="row"
          padding={"0.5rem"}
          spacing={"0.5rem"}
          justifyContent={"space-between"}
        >
          <Button variant="text" color="error" onClick={closeHandler}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={submitHandler}
            disabled={isLoadingNewGroup}
          >
            Create
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default NewGroup;
