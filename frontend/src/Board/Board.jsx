import React, { useEffect, useRef, useState } from "react";
import "./Board.css";
import io from "socket.io-client";

export default function Board() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const points = useRef([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const ioRef = useRef(null);

  // console.log('yo');
  async function sendPoints() {
    if(points.current.length)
    ioRef.current.emit("points", points.current);
    points.current = [];
    return false;
  }
  function drawFrom(pts) {
    if (pts.length === 0) return;
    var [x, y] = pts[0];

    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);

    for (let i = 0; i < pts.length; i++) {
      ctxRef.current.lineTo(pts[i][0], pts[i][1]);

      ctxRef.current.stroke();
    }
    ctxRef.current.closePath();
  }
  useEffect(() => {
    ioRef.current = io.connect("localhost:5000");
    ioRef.current.on("draw", drawFrom);
    const canvas = canvasRef.current;
    canvas.width = 600 * 2;
    canvas.height = 400 * 2;
    canvas.style.width = `${600}px`;
    canvas.style.height = `${400}px`;
    const ctx = canvas.getContext("2d");
    ctx.scale(2, 2);
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 5;
    ctxRef.current = ctx;
    // setInterval(async () => {
    //   if (!points.current.length) return;
    //   //send points
    //   // if sent only then clear points
    //   const res=await sendPoints();
    //   if(!res)
    //     points.current = [];
    //   else console.log(res);
    // }, 1000);
  }, []);

  function startDrawing({ nativeEvent }) {
    const { offsetX, offsetY } = nativeEvent;
    points.current.push([offsetX, offsetY]);
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  }
  function endDrawing() {
    ctxRef.current.closePath();

    setIsDrawing(false);
    sendPoints();
  }
  function draw({ nativeEvent }) {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    points.current.push([offsetX, offsetY]);
    ctxRef.current.lineTo(offsetX, offsetY);

    ctxRef.current.stroke();
  }
  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseUp={endDrawing}
      onMouseMove={draw}
      onMouseLeave={endDrawing}
    />
  );
}
