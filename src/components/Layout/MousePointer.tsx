import AnimatedCursor from "react-animated-cursor"

const MousePointer = () => (
    <AnimatedCursor
        clickables={[
            '.link',
            '.drawer',
            '.MuiPaper-root',
            '.MuiList-root',
            '.pointer-large',
            {
                target: '.link',
                innerScale: 0,
                outerScale: 10,
                color: 'transparent',
                outerStyle: {
                    boxShadow: '0 0 30px rgba(239,13,51, 0.8)',
                }
            },
            {
                target: '.pointer-large',
                innerScale: 0,
                outerScale: 10,
                color: 'transparent',
                outerStyle: {
                    boxShadow: '0 0 30px rgba(239,13,51, 0.8)',
                }
            },
            {
                target: '.pointer-medium',
                innerScale: 0,
                outerScale: 8,
                color: 'transparent',
                outerStyle: {
                    boxShadow: '0 0 30px rgba(239,13,51, 0.8)',
                }
            },
            {
                target: '.pointer-small',
                innerScale: 0,
                outerScale: 5,
                color: 'transparent',
                outerStyle: {
                    boxShadow: '0 0 30px rgba(239,13,51, 0.8)'
                }
            },
        ]}
        color='247, 0, 0'
        innerScale={0.6}
        innerSize={10}
        outerAlpha={0}
        outerScale={4}
        outerSize={6}
        trailingSpeed={8}
        outerStyle={{
            boxShadow: '0 0 30px rgba(239,13,51, 0.8)',
        }}
    />);

export default MousePointer
