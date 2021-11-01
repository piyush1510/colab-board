import React, { useEffect, useRef, useState } from "react";
import "./Board.css";

export default function Board() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const points = useRef([]);
  const [isDrawing, setIsDrawing] = useState(false);
  async function sendPoints() {
    try {
      console.log(points.current);
      return null;
    } catch (err) {
      return err;
    }
  }
  useEffect(() => {
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
    setInterval(async () => {
      if (!points.current.length) return;
      //send points
      // if sent only then clear points
      if(await sendPoints())
        points.current = [];
    }, 1000);
  }, []);

  function startDrawing({ nativeEvent }) {
    const { offsetX, offsetY } = nativeEvent;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  }
  function endDrawing() {
    ctxRef.current.closePath();
    setIsDrawing(false);
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
