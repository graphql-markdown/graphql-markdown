header-object


export const Bullet = () => <><span style={{ fontWeight: 'normal', fontSize: '.5em', color: 'var(--ifm-color-secondary-darkest)' }}>●</span></>

export const SpecifiedBy = (props) => <>Specification<a className="link" style={{ fontSize:'1.5em', paddingLeft:'4px' }} target="_blank" href={props.url} title={'Specified by ' + props.url}>⎘</a></>

export const Badge = (props) => <><span class={'badge badge--' + props.class}>{props.text}</span></>


Test TestObject

```graphql
type TestObject implements TestInterface {
}
```


### Interfaces

#### [`TestInterface`](#)

Test TestInterface






