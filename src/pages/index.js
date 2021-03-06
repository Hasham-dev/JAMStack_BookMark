import React from "react"
import { useQuery, useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import { Link } from 'gatsby';
import './style.css'
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

{/* Get all data mutation type */ }
const BookMarksQuery = gql`{
  bookmark{
    url
    desc
    id
  }
}`

{/* Add mutation type */ }
const AddBookMarkMutation = gql`
  mutation addBookmark($url:String! , $desc: String!){
    addBookmark(url: $url,desc: $desc){
      url
    }
  }
`
{/* Delete mutation type */ }
const deleteBookmark = gql`
  mutation deleteTask($id: ID!) {
    deleteTask(id: $id) {
      id
    }
  }
`;

export default function Home() {
  {/* Using gql data rendering & mutation to handle adding & deletation of bookmarks */ }
  const { loading, error, data } = useQuery(BookMarksQuery);
  const [addBookmark] = useMutation(AddBookMarkMutation);
  const [deleteTask] = useMutation(deleteBookmark);

  {/* Variables declared to saved the input data */ }
  let textfield, desc;

  if (loading)
    return (
      <div className="Progress">

        <CircularProgress color="secondary" />
      </div>
    )

  if (error)
    return <div>Error</div>

  {/* Adding New Bookmark */ }
  const addBookmarkSubmit = () => {
    addBookmark({
      variables: {
        url: textfield.value,
        desc: desc.value
      },
      refetchQueries: [{ query: BookMarksQuery }],
    })
    console.log('textfiled', textfield.value);
    console.log('description', desc.value);
    textfield.value = '';
    desc.value = '';
  }

  {/* Handle Bookmark Deletation */ }

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
    // Bookmark Input
    <div>
      <div className="Contain">

        <Container maxWidth="md" >
          <Grid container spacing={3}>
            <Grid item xs={8} className="Title">
              <h3 className="Bookmark">Bookmark App</h3>
              <p>This App let you save your Bookmark for free</p>
            </Grid>
            <Grid item xs={4}>
              <Paper elevation={3} className="Paper" >
                <h4>Add Bookmark</h4>
                <input type="text" placeholder="Description" ref={node => desc = node} required />
                <br />
                <input type="text" placeholder="URL" ref={node => textfield = node} required />
                <br />
                <Button variant="contained" className="Add-Btn" onClick={addBookmarkSubmit}>Add BookMark</Button >
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </div>
      {/* {console.log(data)} */}

      {/* Card */}
      <Container maxWidth="sm">
        <h1 className="Center">My Bookmarks</h1>
        {data.bookmark.map((bm) => {
          console.log(bm);
          return (
            <div key={bm.ts}>
              <Paper elevation={3} className="List">
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <p className="Desc">{bm.desc}</p>
                  </Grid>
                  <Grid item xs={12}>
                    <p className="Url"><b>URL :</b> {bm.url}</p>
                  </Grid>
                  <Grid item xs={12}>

                    <Link to={bm.url} target="_blank" className="Url-Btn">
                      <Button className="Url-btn-wrap">
                        Visit the Bookmark
                    </Button>
                    </Link>
                    <Button onClick={() => handleDelete(bm.id)} className="Url-btn-wrap">
                      Delete
                  </Button>
                  </Grid>
                </Grid>
              </Paper>
            </div>
          )
        })}
      </Container>
    </div>)
}
