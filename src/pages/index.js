import React from "react"
import { useQuery, useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import { Link } from 'gatsby';


const BookMarksQuery = gql`{
  bookmark{
    url
    desc
    id
  }
}`
const AddBookMarkMutation = gql`
  mutation addBookmark($url:String! , $desc: String!){
    addBookmark(url: $url,desc: $desc){
      url
    }
  }
`

export default function Home() {

  const { loading, error, data } = useQuery(BookMarksQuery);
  const [addBookmark] = useMutation(AddBookMarkMutation);
  let textfield, desc;

  if(loading)
  return <div>Loading...</div>

  if(error)
  return <div>Error</div>
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
  }
  return (<div>
    <div>
      <input type="text" placeholder="URL" ref={node => textfield = node} />
      <br />
      <input type="text" placeholder="Description" ref={node => desc = node} />

      <button onClick={addBookmarkSubmit}>Add BookMark</button>
    </div>
      {/* {console.log(data)} */}
      {data.bookmark.map((bm) => {
        console.log(bm);
        return (
          <div key={bm.ts}>
            <Link to={bm.url}>
            {bm.url}
            </Link>
        <p>{bm.desc}</p>
          </div>
        )
      })}
  </div>)
}
