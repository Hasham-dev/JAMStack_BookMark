import React from 'react';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';

import { Link } from 'gatsby';


export default function Card(url, desc) {
    return (
        <Container maxWidth="sm">
            <h1>My Bookmarks</h1>
            <Paper elevation={3} >
                <div>

                    <p className="Desc">{desc}</p>
                    <p className="Url">{url}</p>
                    <Link to={url} target="_blank" className="Url-Btn">Visit the Bookmark</Link>
                </div>
            </Paper>
        </Container>
    );
}