
import React from "react";
import store from "../store/"
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'

export default class TagContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: ["1", "2"]
        };
    }

    componentDidMount() {

        let headers = new Headers();

        headers.set('Authorization', store.getState().auth.token);

        fetch(process.env.NEXT_PUBLIC_SERVER_ADDRESS + "/api/v1/tags/getAll", { headers: headers })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        items: result.tags
                    });
           
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        items: []
                    });
                }
            )
    }

    updateLoaded() {

        let headers = new Headers();
        headers.set('Authorization', store.getState().auth.token);

        fetch(process.env.NEXT_PUBLIC_SERVER_ADDRESS + "/api/v1/tags/getAll", { headers: headers })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        items: result.tags
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        items: []
                    });
                }
            )
    }


    render() {
        const handleChange = (val) => {
            this.props.container.filterVmByTags(val)
        };

        const { error, isLoaded, items } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {

            if (items.length > 0 && items != null) {
                return (
                    <div style={{ width: "100%", display: "inline-flex", overflow: "auto", marginBottom: "30px" }}>
                        <ToggleButtonGroup type="checkbox" defaultValue={this.state.selectedItems} onChange={handleChange}>
                            {
                                items.map(
                                    (item, index) => (<ToggleButton value={item["name"]}>{item["name"]}</ToggleButton>)
                                )
                            }
                        </ToggleButtonGroup>
                    </div>
                );
            } else {
                return (<div style={{ padding: "15% 0 10% 0", margin: "0 auto", textAlign: "center" }}><h1>Non sono disponibili tag</h1></div>);
            }
        }
    }

}

