"use client";

import { useState } from "react";
import { Reorder } from "framer-motion";
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
  AddListButton,
} from "./styledCompoonents";
import Navbar from "../Navbar";
import { motion } from "framer-motion";

const BoardTasks = () => {
  const [lists, setLists] = useState([
    { title: "To Do", tasks: [], addingTask: false },
    { title: "Doing", tasks: [], addingTask: false },
    { title: "Done", tasks: [], addingTask: false },
  ]);
  const [nextTaskId, setNextTaskId] = useState(1);
  const [addingNewList, setAddingNewList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");

  const handleAddTask = (index, taskText) => {
    if (taskText.trim()) {
      const newTask = { id: nextTaskId, text: taskText };
      const newLists = [...lists];
      newLists[index].tasks.push(newTask);
      newLists[index].addingTask = false;
      setLists(newLists);
      setNextTaskId(nextTaskId + 1);
    }
  };

  const toggleTaskInput = (index) => {
    const newLists = [...lists];
    newLists[index].addingTask = !newLists[index].addingTask;
    setLists(newLists);
  };

  const handleReorder = (index, newTasks) => {
    const newLists = [...lists];
    newLists[index].tasks = newTasks;
    setLists(newLists);
  };

  return (
    <>
      <Navbar />
      <BoardContainer>
        {lists.map((list, index) => (
          <Column key={index}>
            <ColumnTitle>{list.title}</ColumnTitle>

            {list.addingTask ? (
              <TaskInputContainer>
                <TaskInput
                  type="text"
                  placeholder="Enter task..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddTask(index, e.target.value);
                      e.target.value = "";
                    }
                  }}
                />
                <TaskButtonContainer>
                  <TaskButton
                    onClick={() => {
                      const input = document.querySelector(
                        `input[placeholder="Enter task..."]`
                      );
                      if (input?.value.trim()) {
                        handleAddTask(index, input.value);
                        input.value = "";
                      }
                    }}
                  >
                    Add Task
                  </TaskButton>
                  <CancelButton onClick={() => toggleTaskInput(index)}>
                    ✖
                  </CancelButton>
                </TaskButtonContainer>
              </TaskInputContainer>
            ) : (
              <TaskPlaceholder onClick={() => toggleTaskInput(index)}>
                + Add a task
              </TaskPlaceholder>
            )}

            <Reorder.Group
              axis="y"
              values={list.tasks}
              onReorder={(newTasks) => handleReorder(index, newTasks)}
              style={{
                listStyle: "none",
                padding: 0,
                margin: "10px 0",
                position: "relative",
              }}
              as="ul"
            >
              {list.tasks.map((task) => (
                <Reorder.Item key={task.id} value={task}>
                  <motion.div
                    layout
                    transition={{
                      type: "tween",
                      duration: 0.3,
                      ease: "easeOut",
                    }}
                    style={{
                      background: "#f0f0f0",
                      padding: "8px",
                      margin: "3px 0",
                      borderRadius: "3px",
                      textAlign: "left",
                      color: "black",
                      boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.15)",
                      cursor: "grab",
                    }}
                  >
                    {task.text}
                  </motion.div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </Column>
        ))}

        {/* {addingNewList ? (
          <TaskInputContainer>
            <TaskInput
              type="text"
              placeholder="Enter list title..."
              value={newListTitle}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  if (newListTitle.trim()) {
                    setLists([
                      ...lists,
                      { title: newListTitle, tasks: [], addingTask: false },
                    ]);
                    setAddingNewList(false);
                    setNewListTitle("");
                  }
                }
              }}
              onChange={(e) => setNewListTitle(e.target.value)}
            />
            <TaskButtonContainer>
              <TaskButton
                onClick={() => {
                  if (newListTitle.trim()) {
                    setLists([
                      ...lists,
                      { title: newListTitle, tasks: [], addingTask: false },
                    ]);
                    setAddingNewList(false);
                    setNewListTitle("");
                  }
                }}
              >
                Add List
              </TaskButton>
              <CancelButton
                onClick={() => {
                  setAddingNewList(false);
                  setNewListTitle("");
                }}
              >
                ✖
              </CancelButton>
            </TaskButtonContainer>
          </TaskInputContainer>
        ) : (
          <AddListButton onClick={() => setAddingNewList(true)}>
            + Add another list
          </AddListButton>
        )} */}

        {addingNewList ? (
          <TaskInputContainer>
            <TaskInput
              type="text"
              placeholder="Enter list title..."
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (newListTitle.trim()) {
                    setLists([
                      ...lists,
                      { title: newListTitle, tasks: [], addingTask: false },
                    ]);
                    setAddingNewList(false);
                    setNewListTitle("");
                  }
                }
              }}
            />
            <TaskButtonContainer>
              <TaskButton
                onClick={() => {
                  if (newListTitle.trim()) {
                    setLists([
                      ...lists,
                      { title: newListTitle, tasks: [], addingTask: false },
                    ]);
                    setAddingNewList(false);
                    setNewListTitle("");
                  }
                }}
              >
                Add List
              </TaskButton>
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
