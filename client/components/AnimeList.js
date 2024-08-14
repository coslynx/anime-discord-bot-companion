import React, { useState, useEffect } from "react";
import Link from "next/link";

const AnimeList = ({ lists }: { lists: any[] }) => {
  return (
    <div>
      {lists.map((list) => (
        <div key={list.id}>
          <h2>{list.name} ({list.type})</h2>
          <ul>
            {list.animeIds.map((animeId) => (
              <li key={animeId}>
                <Link href={`/anime/${animeId}`}>
                  <a>{animeId}</a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default AnimeList;