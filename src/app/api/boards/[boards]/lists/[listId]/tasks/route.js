// import { NextResponse } from "next/server";
// import { ObjectId } from "mongodb";
// import clientPromise from "../../../../../../../../lib/mongodb";

// export async function GET(req, { params }) {
//   try {
//     const client = await clientPromise;
//     const db = client.db("TaskManager");

//     const { boardId, listId } = params;
//     console.log("Received boardId:", boardId, "listId:", listId);

//     if (
//       !boardId ||
//       typeof boardId !== "string" ||
//       boardId.length !== 24 ||
//       !/^[0-9a-fA-F]{24}$/.test(boardId)
//     ) {
//       console.error("Invalid boardId received:", boardId);
//       return NextResponse.json(
//         {
//           message:
//             "Invalid Board ID format: must be a 24-character hexadecimal string",
//         },
//         { status: 400, headers: { "Content-Type": "application/json" } }
//       );
//     }

//     if (
//       !listId ||
//       typeof listId !== "string" ||
//       listId.length !== 24 ||
//       !/^[0-9a-fA-F]{24}$/.test(listId)
//     ) {
//       console.error("Invalid listId received:", listId);
//       return NextResponse.json(
//         {
//           message:
//             "Invalid List ID format: must be a 24-character hexadecimal string",
//         },
//         { status: 400, headers: { "Content-Type": "application/json" } }
//       );
//     }

//     const board = await db
//       .collection("boards")
//       .findOne({ _id: new ObjectId(boardId) });

//     if (!board) {
//       console.log("Board not found for boardId:", boardId);
//       return NextResponse.json(
//         { message: "Board not found" },
//         { status: 404, headers: { "Content-Type": "application/json" } }
//       );
//     }

//     const list = board.lists.find((list) => list._id.toString() === listId);

//     if (!list) {
//       console.log(`List not found for listId ${listId} in board ${boardId}`);
//       return NextResponse.json(
//         { message: "List not found" },
//         { status: 404, headers: { "Content-Type": "application/json" } }
//       );
//     }

//     console.log(`Returning tasks for list ${listId}:`, list.taskIds);
//     return NextResponse.json(
//       { tasks: list.taskIds || [] },
//       { status: 200, headers: { "Content-Type": "application/json" } }
//     );
//   } catch (error) {
//     console.error("Error fetching tasks:", error);
//     return NextResponse.json(
//       { message: "Internal Server Error", error: error.message },
//       { status: 500, headers: { "Content-Type": "application/json" } }
//     );
//   }
// }

// // export async function POST(req, { params }) {
// //   try {
// //     const client = await clientPromise;
// //     const db = client.db("TaskManager");

// //     const { boardId, listId } = params;
// //     console.log("Received boardId:", boardId, "listId:", listId);

// //     if (
// //       !boardId ||
// //       typeof boardId !== "string" ||
// //       boardId.length !== 24 ||
// //       !/^[0-9a-fA-F]{24}$/.test(boardId)
// //     ) {
// //       console.error("Invalid boardId received:", boardId);
// //       return NextResponse.json(
// //         {
// //           message:
// //             "Invalid Board ID format: must be a 24-character hexadecimal string",
// //         },
// //         { status: 400, headers: { "Content-Type": "application/json" } }
// //       );
// //     }

// //     if (
// //       !listId ||
// //       typeof listId !== "string" ||
// //       listId.length !== 24 ||
// //       !/^[0-9a-fA-F]{24}$/.test(listId)
// //     ) {
// //       console.error("Invalid listId received:", listId);
// //       return NextResponse.json(
// //         {
// //           message:
// //             "Invalid List ID format: must be a 24-character hexadecimal string",
// //         },
// //         { status: 400, headers: { "Content-Type": "application/json" } }
// //       );
// //     }

// //     const { taskName } = await req.json();
// //     if (!taskName || typeof taskName !== "string" || taskName.trim() === "") {
// //       console.error("Invalid taskName received:", taskName);
// //       return NextResponse.json(
// //         { message: "Task name is required and must be a non-empty string" },
// //         { status: 400, headers: { "Content-Type": "application/json" } }
// //       );
// //     }

// //     const board = await db
// //       .collection("boards")
// //       .findOne({ _id: new ObjectId(boardId) });

// //     if (!board) {
// //       console.log("Board not found for boardId:", boardId);
// //       return NextResponse.json(
// //         { message: "Board not found" },
// //         { status: 404, headers: { "Content-Type": "application/json" } }
// //       );
// //     }

// //     const listIndex = board.lists.findIndex(
// //       (list) => list._id.toString() === listId
// //     );
// //     if (listIndex === -1) {
// //       console.log(`List not found for listId ${listId} in board ${boardId}`);
// //       return NextResponse.json(
// //         { message: "List not found" },
// //         { status: 404, headers: { "Content-Type": "application/json" } }
// //       );
// //     }

// //     const newTask = {
// //       _id: new ObjectId(),
// //       text: taskName.trim(),
// //     };

// //     const updateResult = await db
// //       .collection("boards")
// //       .findOneAndUpdate(
// //         { _id: new ObjectId(boardId), "lists._id": new ObjectId(listId) },
// //         { $push: { "lists.$.taskIds": newTask } },
// //         { returnDocument: "after" }
// //       );

// //     if (!updateResult.value) {
// //       console.error("Failed to add task to list:", listId);
// //       return NextResponse.json(
// //         { message: "Failed to add task" },
// //         { status: 500, headers: { "Content-Type": "application/json" } }
// //       );
// //     }

// //     console.log("Updated board:", updateResult.value);
// //     return NextResponse.json(
// //       { message: "Task added successfully", updatedList: updateResult.value },
// //       { status: 201, headers: { "Content-Type": "application/json" } }
// //     );
// //   } catch (error) {
// //     console.error("Error adding task:", error);
// //     return NextResponse.json(
// //       { message: "Internal Server Error", error: error.message },
// //       { status: 500, headers: { "Content-Type": "application/json" } }
// //     );
// //   }
// // }
