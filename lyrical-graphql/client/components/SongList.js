import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

class SongList extends Component {
    renderSong(song) {
        return (
            <li className="collection-item" key={song.id} >{song.title}</li>
        );
    }

    render() {
        if(this.props.data.loading) return <div>Loading...</div>;

        const songs = this.props.data.songs || [];
        return (
            <ul className="collection">
                {songs.map(this.renderSong)}
            </ul>
        );
    }
}

const query = gql`
    {
        songs {
            id
            title
        }
    }
`;

export default graphql(query)(SongList);