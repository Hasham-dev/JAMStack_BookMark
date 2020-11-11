import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { useQuery, useMutation } from '@apollo/client'
import Button from '@material-ui/core/Button';
import { Link } from 'gatsby';
import gql from 'graphql-tag'

const BookMarksQuery = gql`{
    bookmark{
      url
      desc
      id
    }
  }`

const deleteTodo = gql`
mutation deleteTask($id: ID!) {
  deleteTask(id: $id) {
    id
  }
}
`;

export default function Card({ key, url, desc }) {

    const { loading, error, data } = useQuery(BookMarksQuery);
    const [deleteTask] = useMutation(deleteTodo);


    const handleDelete = (id) => {
        console.log(JSON.stringify(id))
        deleteTask({
            variables: {
                id: id,
            },
            refetchQueries: [{ query: BookMarksQuery }],
        });
    };
    
    return (
        <div>

            {
                data.bookmark.map((bm) => {
                    console.log(bm);
                    return (
                        <div key={key}>
                            <Paper elevation={3} className="List">
                                <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        <p className="Desc">{desc}</p>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <p className="Url"><b>URL :</b> {url}</p>
                                    </Grid>
                                    <Grid item xs={12}>

                                        <Link to={bm.url} target="_blank" className="Url-Btn">
                                            <Button className="Url-btn-wrap">
                                                Visit the Bookmark
                                            </Button>
                                        </Link>
                                        <Button onClick={() => handleDelete(key)} className="Url-btn-wrap">
                                            Delete
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </div>
                    )
                })
            }
        </div>
    );
}