import './commonList.css'
import moment from 'moment'

const CommonList = (props) => {

    const list = props.list;

    const data = props.data;

    const color = { View: '#ff8517', Reject: '#4a4a4a', Cancel: '#ff696e', Request: '#0ca85a', Sent: '#357994', Approve: '#ad639e', Return: '#00abab', }

    return (
        <div className='mainView'>
            <table>
                <tbody>
                    <tr>
                        {list?.map((item, i) => (
                            <th key={item.column}>{item?.suffixText}</th>
                        ))}
                    </tr>
                    {data?.length > 0 && data?.map((item, key) => (
                        <tr key={key}>
                            {list?.map((val, k) => (
                                val?.type === 'Text' ?
                                    <td key={key + k}>{item[val?.column]}</td>
                                    :
                                    val.type === 'Date' ?
                                        <td key={key + k}>{item[val?.column] ? moment(item[val?.column]).format('DD/MM/YYYY') : 'N/A'}</td>
                                        :
                                        val.type === 'Button' ?
                                            <div className='iconContainer'>
                                                {typeof (item[val?.column]) == 'string' ?
                                                    <td key={key + k}>
                                                        <button onClick={() => { props?.onClick(item[val?.column], item) }} style={{ backgroundColor: color[item[val?.column]] }}>{item[val?.column]}</button>
                                                        {(!item.due_date && item.reason) &&
                                                            <p className='rejectMsg' >Rejected : {item.reason}</p>
                                                        }
                                                    </td>
                                                    :
                                                    <div>
                                                        {
                                                            item[val?.column]?.map((iconName, index) => (
                                                                <td key={key + k + index}><button onClick={() => {
                                                                    props?.onClick(iconName, item)
                                                                }} style={{ backgroundColor: color[iconName] }}>{iconName}</button>
                                                                </td>
                                                            ))
                                                        }
                                                        {(!item.due_date && item.reason) &&
                                                            <p className="rejectMsg">Rejected : {item.reason}</p>
                                                        }
                                                    </div>
                                                }
                                            </div>
                                            :
                                            <div className='iconContainer'>
                                                {val.icon?.map((iconName, index) => (
                                                    <i key={key + k + index} className={"fas " + iconName} style={{ color: val.color[index] }} onClick={() => { props?.onClick(val.name[index], item) }}></i>
                                                ))}
                                            </div>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {!data?.length && <p className='noRecord'>No Record Founds</p>}
        </div>
    )
}

export default CommonList;