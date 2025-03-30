import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "../../../../../../lib/mongodb";

export async function POST(req, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db("TaskManager");

    const { boards } = params;
    console.log("Received boardId:", boards);

    // Validate ObjectId
    if (!ObjectId.isValid(boards)) {
      return NextResponse.json(
        { message: "Invalid Board ID format" },
        { status: 400 }
      );
    }

    // Find the board
    const board = await db
      .collection("boards")
      .findOne({ _id: new ObjectId(boards) });

    console.log("Board from DB:", board);

    if (!board) {
      return NextResponse.json({ message: "Board not found" }, { status: 404 });
    }

    // Parse the request body
    const { listName } = await req.json();
    if (!listName || typeof listName !== "string") {
      return NextResponse.json(
        { message: "Invalid list name" },
        { status: 400 }
      );
    }

    // Create the new list object
    const newList = {
      _id: new ObjectId(), // Generate a unique ID for the list
      listName,
      taskIds: [],
    };

    // Update the board by adding the new list
    const updateResult = await db.collection("boards").updateOne(
      { _id: new ObjectId(boards) },
      { $push: { lists: newList } } // Push the new list into the "lists" array
    );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json(
        { message: "Failed to add list" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "List added successfully", newList },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding list:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
export async function GET(req, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db("TaskManager");

    const { boards } = params;
    console.log("Received boardId:", boards);

    if (!boards || !ObjectId.isValid(boards)) {
      console.error("Invalid boardId received:", boards);
      return NextResponse.json(
        { message: "Invalid Board ID format" },
        { status: 400 }
      );
    }

    const boardData = await db
      .collection("boards")
      .findOne({ _id: new ObjectId(boards) });

    console.log(boardData, "boards boardData");

    if (!boardData) {
      return NextResponse.json({ message: "Board not found" }, { status: 404 });
    }

    return NextResponse.json({ lists: boardData.lists || [] }, { status: 200 });
  } catch (error) {
    console.error("Error fetching board lists:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
