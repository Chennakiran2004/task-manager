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
} from "./styledCompoonents";
import Navbar from "../Navbar";
import { useParams } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Reorder } from "framer-motion"; // Import Reorder from framer-motion
import { BASE_URL } from "@/Constants/apiConstants";

const BoardTasks = () => {
  const [lists, setLists] = useState([]);
  const [addingNewList, setAddingNewList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [newTaskTexts, setNewTaskTexts] = useState({});
  const [isLoading, setIsLoading] = useState(false);
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
          tasks: list.tasks || [],
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

        // const response = await fetch(`/api/boards/${boardId}/lists/${listId}`);
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
    } catch (error) {
      console.error("Error deleting list:", error.message);
    }
  };

  // Handle task reordering within a list
  const handleTaskReorder = (index, newTasks) => {
    const newLists = [...lists];
    newLists[index].tasks = newTasks;
    setLists(newLists);

    // Optional: Update the backend with the new task order
    updateTaskOrderInBackend(newLists[index]._id, newTasks);
  };

  // Handle list reordering
  const handleListReorder = (newLists) => {
    setLists(newLists);

    // Optional: Update the backend with the new list order
    updateListOrderInBackend(newLists);
  };

  // Optional: Update task order in the backend
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

  // Optional: Update list order in the backend
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

  return (
    <>
      <Navbar />
      <BoardContainer>
        {/* Wrap lists in Reorder.Group for list reordering */}
        <Reorder.Group
          axis="x"
          values={lists}
          onReorder={handleListReorder}
          as="div"
          style={{ display: "flex", gap: "20px" }} // Adjust styling as needed
        >
          {lists.map((list, index) => (
            <Reorder.Item key={list._id} value={list}>
              <Column>
                <ListTitleContainer>
                  <ColumnTitle>{list.title}</ColumnTitle>
                  <Trash2
                    size={20}
                    style={{ cursor: "pointer", color: "red" }}
                    onClick={() => handleDeleteList(list._id, index)}
                  />
                </ListTitleContainer>

                {/* Task reordering */}
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
