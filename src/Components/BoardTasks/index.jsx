"use client";

import { useState, useEffect } from "react";
import {
  BoardContainer,
  Column,
  ColumnTitle,
  TaskPlaceholder,
  TaskInputContainer,
  TaskInput,
  TaskButtonContainer,
  TaskButton,
  CancelButton,
  TaskCard,
  AddListButton,
  ListTitleContainer,
  ListOptionsButton,
  ListOptionsMenu,
  ListOption,
} from "./styledCompoonents";
import Navbar from "../Navbar";
import { useParams } from "next/navigation";
import { Reorder } from "framer-motion";
import { BASE_URL } from "@/Constants/apiConstants";
import { MoreVertical } from "lucide-react";

const BoardTasks = () => {
  const [lists, setLists] = useState([]);
  const [addingNewList, setAddingNewList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [newTaskTexts, setNewTaskTexts] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [editingListId, setEditingListId] = useState(null);
  const [editedListName, setEditedListName] = useState("");
  const [menuOpenListId, setMenuOpenListId] = useState(null);
  const params = useParams();
  const boardId = params.board?.toString().trim();

  useEffect(() => {
    const fetchLists = async () => {
      try {
        if (!boardId) {
          console.error("Board ID is missing");
          return;
        }

        const response = await fetch(`${BASE_URL}api/boards/${boardId}/lists`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to fetch lists: ${errorData.message}`);
        }

        const data = await response.json();
        const formattedLists = (data.lists || []).map((list) => ({
          ...list,
          title: list.listName,
          tasks: list.taskIds || [],
          addingTask: false,
        }));

        setLists(formattedLists);

        for (let i = 0; i < formattedLists.length; i++) {
          fetchTasksForList(formattedLists[i]._id, i);
        }
      } catch (error) {
        console.error("Error fetching lists:", error.message);
      }
    };

    const fetchTasksForList = async (listId, index) => {
      try {
        if (!boardId || !listId) return;

        const response = await fetch(
          `${BASE_URL}api/boards/${boardId}/lists/${listId}/tasks`
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to fetch tasks: ${errorData.message}`);
        }

        const { tasks } = await response.json();

        setLists((prevLists) => {
          const updatedLists = [...prevLists];
          updatedLists[index].tasks = tasks;
          return updatedLists;
        });
      } catch (error) {
        console.error("Error fetching tasks:", error.message);
      }
    };

    if (boardId) {
      fetchLists();
    }
  }, [boardId]);

  const handleAddTask = async (index) => {
    const taskText = newTaskTexts[index] || "";
    if (!taskText.trim() || isLoading) return;

    const listId = lists[index]._id;
    if (!boardId || !listId) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}api/boards/${boardId}/lists/${listId}/tasks`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ taskName: taskText }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add task: ${errorText}`);
      }

      const data = await response.json();

      setLists((prevLists) => {
        const updatedLists = [...prevLists];
        const taskExists = updatedLists[index].tasks.some(
          (task) => task._id === data.task._id
        );

        if (!taskExists) {
          updatedLists[index].tasks = [...updatedLists[index].tasks, data.task];
        }

        updatedLists[index].addingTask = false;
        return updatedLists;
      });

      setNewTaskTexts((prev) => ({ ...prev, [index]: "" }));
    } catch (error) {
      console.error("Error adding task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddTask(index);
    }
  };

  const toggleTaskInput = (index) => {
    const newLists = [...lists];
    newLists[index].addingTask = !newLists[index].addingTask;
    setLists(newLists);
  };

  const handleAddList = async () => {
    if (!newListTitle.trim() || !boardId) {
      console.error("Invalid boardId or list title:", {
        boardId,
        newListTitle,
      });
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}api/boards/${boardId}/lists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listName: newListTitle }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add list: ${errorData.message}`);
      }

      const { newList } = await response.json();
      const formattedNewList = {
        ...newList,
        title: newList.listName,
        tasks: [],
        addingTask: false,
      };
      setLists([...lists, formattedNewList]);
      setNewListTitle("");
      setAddingNewList(false);
    } catch (error) {
      console.error("Error adding list:", error.message);
    }
  };

  const handleTaskInputChange = (index, value) => {
    setNewTaskTexts((prev) => ({ ...prev, [index]: value }));
  };

  const handleDeleteList = async (listId, index) => {
    if (!boardId || !listId) {
      console.error("Invalid boardId or listId:", { boardId, listId });
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}api/boards/${boardId}/lists/${listId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(`Failed to delete list: ${errorData.message}`);
        } else {
          const errorText = await response.text();
          throw new Error(
            `Failed to delete list: ${errorText || response.statusText}`
          );
        }
      }

      setLists((prevLists) => {
        const updatedLists = [...prevLists];
        updatedLists.splice(index, 1);
        return updatedLists;
      });
      setMenuOpenListId(null);
    } catch (error) {
      console.error("Error deleting list:", error.message);
    }
  };

  const handleTaskReorder = (index, newTasks) => {
    const newLists = [...lists];
    newLists[index].tasks = newTasks;
    setLists(newLists);
    updateTaskOrderInBackend(newLists[index]._id, newTasks);
  };

  const handleListReorder = (newLists) => {
    setLists(newLists);
    updateListOrderInBackend(newLists);
  };

  const updateTaskOrderInBackend = async (listId, tasks) => {
    if (!boardId || !listId) return;

    try {
      const response = await fetch(
        `/api/boards/${boardId}/lists/${listId}/reorder`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tasks: tasks.map((task) => task._id) }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update task order: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error updating task order:", error.message);
    }
  };

  const updateListOrderInBackend = async (lists) => {
    if (!boardId) return;

    try {
      const response = await fetch(`/api/boards/${boardId}/lists/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lists: lists.map((list) => list._id) }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update list order: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error updating list order:", error.message);
    }
  };

  const handleUpdateListName = async (listId, index) => {
    if (!editedListName.trim() || !boardId || !listId) {
      console.error("Invalid list name or IDs:", {
        boardId,
        listId,
        editedListName,
      });
      setEditingListId(null);
      setMenuOpenListId(null);
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}api/boards/${boardId}/lists/${listId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ listName: editedListName }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update list name: ${errorData.message}`);
      }

      const { updatedList } = await response.json();
      setLists((prevLists) => {
        const updatedLists = [...prevLists];
        updatedLists[index].title = updatedList.listName;
        return updatedLists;
      });
      setEditingListId(null);
      setMenuOpenListId(null);
    } catch (error) {
      console.error("Error updating list name:", error.message);
    }
  };

  const toggleMenu = (listId) => {
    setMenuOpenListId(menuOpenListId === listId ? null : listId);
    setEditingListId(null);
  };

  const startEditingList = (listId, currentName) => {
    setEditingListId(listId);
    setEditedListName(currentName);
    setMenuOpenListId(null);
  };

  return (
    <>
      <Navbar />
      <BoardContainer>
        <Reorder.Group
          axis="x"
          values={lists}
          onReorder={handleListReorder}
          as="div"
          style={{ display: "flex", gap: "20px" }}
        >
          {lists.map((list, index) => (
            <Reorder.Item key={list._id} value={list}>
              <Column>
                <ListTitleContainer>
                  {editingListId === list._id ? (
                    <TaskInput
                      type="text"
                      value={editedListName}
                      onChange={(e) => setEditedListName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleUpdateListName(list._id, index);
                        } else if (e.key === "Escape") {
                          setEditingListId(null);
                        }
                      }}
                      onBlur={() => handleUpdateListName(list._id, index)}
                      autoFocus
                    />
                  ) : (
                    <ColumnTitle>{list.title}</ColumnTitle>
                  )}
                  <ListOptionsButton onClick={() => toggleMenu(list._id)}>
                    <MoreVertical size={20} />
                  </ListOptionsButton>
                  {menuOpenListId === list._id && (
                    <ListOptionsMenu>
                      <ListOption
                        onClick={() => startEditingList(list._id, list.title)}
                      >
                        Update List
                      </ListOption>
                      <ListOption
                        onClick={() => handleDeleteList(list._id, index)}
                      >
                        Close List
                      </ListOption>
                    </ListOptionsMenu>
                  )}
                </ListTitleContainer>

                <Reorder.Group
                  axis="y"
                  values={list.tasks}
                  onReorder={(newTasks) => handleTaskReorder(index, newTasks)}
                  as="ul"
                  style={{ listStyle: "none", padding: 0, margin: "10px 0" }}
                >
                  {list.tasks?.map((task) => (
                    <Reorder.Item key={task._id} value={task}>
                      <TaskCard>{task.text}</TaskCard>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>

                {list.addingTask ? (
                  <TaskInputContainer>
                    <TaskInput
                      type="text"
                      placeholder="Enter task..."
                      value={newTaskTexts[index] || ""}
                      onChange={(e) =>
                        handleTaskInputChange(index, e.target.value)
                      }
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      disabled={isLoading}
                    />
                    <TaskButtonContainer>
                      <TaskButton
                        onClick={() => handleAddTask(index)}
                        disabled={isLoading}
                      >
                        {isLoading ? "Adding..." : "Add Task"}
                      </TaskButton>
                      <CancelButton
                        onClick={() => toggleTaskInput(index)}
                        disabled={isLoading}
                      >
                        ✖
                      </CancelButton>
                    </TaskButtonContainer>
                  </TaskInputContainer>
                ) : (
                  <TaskPlaceholder onClick={() => toggleTaskInput(index)}>
                    + Add a task
                  </TaskPlaceholder>
                )}
              </Column>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        {addingNewList ? (
          <TaskInputContainer>
            <TaskInput
              type="text"
              placeholder="Enter list title..."
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddList();
                }
              }}
            />
            <TaskButtonContainer>
              <TaskButton onClick={handleAddList}>Add List</TaskButton>
              <CancelButton onClick={() => setAddingNewList(false)}>
                ✖
              </CancelButton>
            </TaskButtonContainer>
          </TaskInputContainer>
        ) : (
          <AddListButton onClick={() => setAddingNewList(true)}>
            + Add another list
          </AddListButton>
        )}
      </BoardContainer>
    </>
  );
};

export default BoardTasks;
