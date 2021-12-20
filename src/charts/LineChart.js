import React from 'react';
import './LineChart.css';
import Paper from '@material-ui/core/Paper';
import {ArgumentAxis, Chart, LineSeries, Title, Tooltip, ValueAxis} from '@devexpress/dx-react-chart-material-ui';
import {ArgumentScale, EventTracker} from '@devexpress/dx-react-chart';
import {withStyles} from '@material-ui/core/styles';
import {Col} from "react-bootstrap";
import {scaleTime} from 'd3-scale';

function LineChart(props) {

    const {data} = props;

    // const format = () => tick => tick;
    // const legendStyles = () => ({
    //     root: {
    //         display: 'flex',
    //         margin: 'auto',
    //         flexDirection: 'row',
    //     },
    // });
    // const legendLabelStyles = theme => ({
    //     label: {
    //         paddingTop: theme.spacing(1),
    //         whiteSpace: 'nowrap',
    //     },
    // });
    // const legendItemStyles = () => ({
    //     item: {
    //         flexDirection: 'column',
    //     },
    // });

    // const legendRootBase = ({classes, ...restProps}) => (
    //     <Legend.Root {...restProps} className={classes.root}/>
    // );
    // const legendLabelBase = ({classes, ...restProps}) => (
    //     <Legend.Label className={classes.label} {...restProps} />
    // );
    // const legendItemBase = ({classes, ...restProps}) => (
    //     <Legend.Item className={classes.item} {...restProps} />
    // );
    // const Root = withStyles(legendStyles, {name: 'LegendRoot'})(legendRootBase);
    // const Label = withStyles(legendLabelStyles, {name: 'LegendLabel'})(legendLabelBase);
    // const Item = withStyles(legendItemStyles, {name: 'LegendItem'})(legendItemBase);
    // const demoStyles = () => ({
    //     chart: {
    //         paddingRight: '20px',
    //     },
    //     title: {
    //         whiteSpace: 'pre',
    //     },
    // });

    const ValueLabel = (props) => {
        const {text} = props;
        return (
            <ValueAxis.Label
                {...props}
                text={`${text}`}
            />
        );
    };

    let multiple = 2;

    const ArgumentLabel = (props) => {
        if (multiple === 2) {
            multiple = 1;
        } else {
            multiple = 2;
        }
        return (
            <ArgumentAxis.Label
                {...props}
                dy={multiple === 1 ? '1em' : '3em'}
                textAnchor='middle'
            />
        );
    };

    const titleStyles = {
        title: {
            whiteSpace: 'pre',
        },
    };
    const TitleText = withStyles(titleStyles)(({classes, ...props}) => (
        <Title.Text {...props} className={classes.title}/>
    ));
    return (
        <Col md={6} xs={12}>
            <Paper elevation={3}>
                <Chart
                    data={data}
                >
                    <ArgumentAxis labelComponent={ArgumentLabel}/>
                    <ValueAxis
                        max={50}
                        labelComponent={ValueLabel}
                    />
                    <ArgumentScale factory={scaleTime}/>

                    <LineSeries
                        name="Glucose Level"
                        valueField="value" argumentField="time"
                    />
                    <EventTracker/>
                    <Tooltip/>
                    <Title
                        text={`Glucose Level`}
                        textComponent={TitleText}
                    />
                </Chart>
            </Paper>
        </Col>
    );
}

export default LineChart;