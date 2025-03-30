// "use client";

// import { useState, useEffect } from "react";
// import { Reorder } from "framer-motion";
// import {
//   BoardContainer,
//   Column,
//   ColumnTitle,
//   TaskPlaceholder,
//   TaskInputContainer,
//   TaskInput,
//   TaskButtonContainer,
//   TaskButton,
//   CancelButton,
//   AddListButton,
// } from "./styledCompoonents";
// import Navbar from "../Navbar";
// import { motion } from "framer-motion";
// import { useParams } from "next/navigation";

// const BoardTasks = () => {
//   const [lists, setLists] = useState([]);
//   const [nextTaskId, setNextTaskId] = useState(1);
//   const [addingNewList, setAddingNewList] = useState(false);
//   const [newListTitle, setNewListTitle] = useState("");
//   const params = useParams();
//   const boardId = params.board?.toString().trim();

//   useEffect(() => {
//     const fetchLists = async () => {
//       try {
//         if (!boardId) {
//           console.error("Board ID is missing");
//           return;
//         }

//         // Fetch lists for the board
//         const response = await fetch(`/api/boards/${boardId}/lists`);
//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(`Failed to fetch lists: ${errorData.message}`);
//         }

//         const data = await response.json();
//         const formattedLists = (data.lists || []).map((list) => ({
//           ...list,
//           title: list.listName,
//           tasks: [],
//           addingTask: false,
//         }));

//         setLists(formattedLists);

//         // Fetch tasks for each list
//         for (let i = 0; i < formattedLists.length; i++) {
//           fetchTasksForList(formattedLists[i]._id, i);
//         }
//       } catch (error) {
//         console.error("Error fetching lists:", error.message);
//       }
//     };

//     const fetchTasksForList = async (listId, index) => {
//       try {
//         if (!boardId || !listId) return;

//         const response = await fetch(`/api/boards/${boardId}/lists/${listId}`);
//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(`Failed to fetch tasks: ${errorData.message}`);
//         }

//         const { tasks } = await response.json();

//         setLists((prevLists) => {
//           const updatedLists = [...prevLists];
//           updatedLists[index].tasks = tasks;
//           return updatedLists;
//         });
//       } catch (error) {
//         console.error("Error fetching tasks:", error.message);
//       }
//     };

//     if (boardId) {
//       fetchLists();
//     }
//   }, [boardId]);
//   const handleAddTask = async (index, taskText) => {
//     if (!taskText.trim()) return;

//     const listName = lists[index].title;
//     if (!boardId || !listName) {
//       console.error("Board ID or List Name missing:", { boardId, listName });
//       return;
//     }

//     try {
//       const response = await fetch(
//         `/api/boards/${boardId}/lists/${encodeURIComponent(listName)}/tasks`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ taskName: taskText }),
//         }
//       );

//       console.log("Raw response:", response);

//       if (!response.ok) {
//         console.error("Failed Response:", response.status, response.statusText);
//         const errorText = await response.text(); // Read as text before parsing
//         console.error("Error response text:", errorText);
//         throw new Error(`Failed to add task: ${errorText}`);
//       }

//       const data = await response.json();
//       console.log("API Response Data:", data);

//       const updatedLists = [...lists];
//       updatedLists[index].tasks = data.updatedList.lists.find(
//         (list) => list.listName === listName
//       ).tasks;

//       setLists(updatedLists);
//     } catch (error) {
//       console.error("Error adding task:", error.message);
//     }
//   };

//   const toggleTaskInput = (index) => {
//     const newLists = [...lists];
//     newLists[index].addingTask = !newLists[index].addingTask;
//     setLists(newLists);
//   };

//   const handleAddList = async () => {
//     if (!newListTitle.trim() || !boardId) {
//       console.error("Invalid boardId or list title:", {
//         boardId,
//         newListTitle,
//       });
//       return;
//     }

//     try {
//       const requestBody = JSON.stringify({ listName: newListTitle });
//       console.log("Request Body:", requestBody);

//       const response = await fetch(`/api/boards/${boardId}/lists`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: requestBody,
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error("Failed to add list. Response:", errorData);
//         throw new Error(`Failed to add list: ${errorData.message}`);
//       }

//       const { newList } = await response.json();
//       const formattedNewList = {
//         ...newList,
//         title: newList.listName,
//         tasks: newList.taskIds || [],
//         addingTask: false,
//       };
//       setLists([...lists, formattedNewList]);
//       setNewListTitle("");
//       setAddingNewList(false);
//     } catch (error) {
//       console.error("Error adding list:", error.message);
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <BoardContainer>
//         {lists.map((list, index) => (
//           <Column key={index}>
//             <ColumnTitle>{list.title}</ColumnTitle>

//             {list.addingTask ? (
//               <TaskInputContainer>
//                 <TaskInput
//                   type="text"
//                   placeholder="Enter task..."
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") {
//                       handleAddTask(index, e.target.value);
//                       e.target.value = "";
//                     }
//                   }}
//                 />
//                 <TaskButtonContainer>
//                   <TaskButton
//                     onClick={() => {
//                       const input = document.querySelector(
//                         `input[placeholder="Enter task..."]`
//                       );
//                       if (input?.value.trim()) {
//                         handleAddTask(index, input.value);
//                         input.value = "";
//                       }
//                     }}
//                   >
//                     Add Task
//                   </TaskButton>
//                   <CancelButton onClick={() => toggleTaskInput(index)}>
//                     ✖
//                   </CancelButton>
//                 </TaskButtonContainer>
//               </TaskInputContainer>
//             ) : (
//               <TaskPlaceholder onClick={() => toggleTaskInput(index)}>
//                 + Add a task
//               </TaskPlaceholder>
//             )}
//           </Column>
//         ))}

//         {addingNewList ? (
//           <TaskInputContainer>
//             <TaskInput
//               type="text"
//               placeholder="Enter list title..."
//               value={newListTitle}
//               onChange={(e) => setNewListTitle(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") {
//                   if (newListTitle.trim()) {
//                     setLists([
//                       ...lists,
//                       { title: newListTitle, tasks: [], addingTask: false },
//                     ]);
//                     setAddingNewList(false);
//                     setNewListTitle("");
//                   }
//                 }
//               }}
//             />
//             <TaskButtonContainer>
//               <TaskButton onClick={handleAddList}>Add List</TaskButton>
//               <CancelButton onClick={() => setAddingNewList(false)}>
//                 ✖
//               </CancelButton>
//             </TaskButtonContainer>
//           </TaskInputContainer>
//         ) : (
//           <AddListButton onClick={() => setAddingNewList(true)}>
//             + Add another list
//           </AddListButton>
//         )}
//       </BoardContainer>
//     </>
//   );
// };

// export default BoardTasks;

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
} from "./styledCompoonents";
import Navbar from "../Navbar";
import { useParams } from "next/navigation";

const BoardTasks = () => {
  const [lists, setLists] = useState([]);
  const [addingNewList, setAddingNewList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const params = useParams();
  const boardId = params.board?.toString().trim();

  useEffect(() => {
    const fetchLists = async () => {
      try {
        if (!boardId) {
          console.error("Board ID is missing");
          return;
        }

        const response = await fetch(`/api/boards/${boardId}/lists`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to fetch lists: ${errorData.message}`);
        }

        const data = await response.json();
        const formattedLists = (data.lists || []).map((list) => ({
          ...list,
          title: list.listName,
          tasks: [],
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

        const response = await fetch(`/api/boards/${boardId}/lists/${listId}`);
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

  const handleAddTask = async (index, taskText) => {
    if (!taskText.trim()) return;

    const listId = lists[index]._id;
    if (!boardId || !listId) {
      console.error("Board ID or List ID missing:", { boardId, listId });
      return;
    }

    try {
      const response = await fetch(`/api/boards/${boardId}/lists/${listId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskName: taskText }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add task: ${errorText}`);
      }

      const data = await response.json();
      const updatedLists = [...lists];
      updatedLists[index].tasks = data.updatedList.tasks;

      setLists(updatedLists);
    } catch (error) {
      console.error("Error adding task:", error.message);
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
      const response = await fetch(`/api/boards/${boardId}/lists`, {
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

  return (
    <>
      <Navbar />
      <BoardContainer>
        {lists.map((list, index) => (
          <Column key={index}>
            <ColumnTitle>{list.title}</ColumnTitle>

            {list.tasks.map((task) => (
              <TaskCard key={task._id}>{task.text}</TaskCard>
            ))}

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
          </Column>
        ))}

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
