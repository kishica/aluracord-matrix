import { Box, Text, TextField, Image, Button } from '@skynexui/components'
import React from 'react'
import { useState } from 'react/cjs/react.development'
import appConfig from '../config.json'
import { useRouter } from 'next/router'
import { createClient } from '@supabase/supabase-js'
import { ButtonSendSticker } from '../src/components/ButtonSendSticker'

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMxMDg5MywiZXhwIjoxOTU4ODg2ODkzfQ.Ys997gyxDMIeM-fF099bX-_kdFOBEUk9_c1cUE8pScM'
const SUPABASE_URL = 'https://nhczmkrhbakwrmgcrlzy.supabase.co'
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

function messageInRealTimeListener(addMessage) {
    return supabaseClient
        .from('mensagens')
        .on('INSERT', (response) => {
            addMessage(response.new)
        })
        .subscribe()

}

export default function ChatPage() {

    const roteamento = useRouter()
    const loggedUser = roteamento.query.username
    const [mensagem, setMensagem] = React.useState('')
    const [listaDeMensagens, setListaDeMensagens] = React.useState([])

    React.useEffect(() => {
        supabaseClient
            .from('mensagens')
            .select('*')
            .order('id', { ascending: false })
            .then(({ data }) => {
                setListaDeMensagens(data)
            })
        messageInRealTimeListener((newMessage) => {
            console.log('Nova Mensagem:', newMessage)
            setListaDeMensagens((actualList) => {
                return [
                    newMessage,
                    ...actualList
                ]
            })
        })
    }, [])

    function handleNewMessage(newMessage) {

        if (newMessage.length <= 0)
            return
        const message = {
            from: loggedUser,
            text: newMessage,
        }

        supabaseClient
            .from('mensagens')
            .insert([
                message
            ])
            .then(({ data }) => {
                /* setListaDeMensagens([
                    data[0],
                    ...listaDeMensagens 
                ])*/
            })
        setMensagem('')
    }

    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >
                    <MessageList mensagens={listaDeMensagens} />

                    {/* Lista de Mensagens: {listaDeMensagens.map((actualMessage) => {                        
                        return (
                            <li key={actualMessage.id}>
                                {actualMessage.from} : {actualMessage.text}
                            </li>
                        )
                    })} */}
                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            value={mensagem}
                            onChange={(event) => {
                                const valor = event.target.value
                                setMensagem(valor)
                            }}
                            onKeyPress={(event) => {
                                if ((event.key === 'Enter') &&
                                    (!event.shiftKey)) {
                                    event.preventDefault()
                                    handleNewMessage(mensagem)
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        <ButtonSendSticker

                            styleSheet={{
                                borderRadius: '10px',
                                padding: '6px 8px',
                                marginRight: '12px',
                                resize: 'none',
                            }}

                            onStickerClick={(sticker) => {
                                handleNewMessage(':sticker:' + sticker)
                            }}
                        />
                        <Button
                            variant='primary'
                            colorVariant='neutral'
                            label='Enviar'

                            styleSheet={{                   
                                             
                                
                                padding: '6px 8px',
                                marginLeft: '12px',
                                resize: 'none',
                            }}

                            onClick={() => {
                                handleNewMessage(mensagem)
                            }}
                        />

                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {props.mensagens.map((mensagem) => {
                return (
                    <Text
                        key={mensagem.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${mensagem.from}.png`}
                            />
                            <Text tag="strong">
                                {mensagem.from}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {(new Date().toLocaleDateString())}
                            </Text>
                        </Box>
                        {mensagem.text.startsWith(':sticker:') ?
                            (
                                <Image
                                    src={mensagem.text.replace(':sticker:', '')}
                                    styleSheet={{
                                        maxWidth: '180px'
                                    }}

                                />
                            )
                            :
                            (
                                mensagem.text
                            )
                        }
                    </Text>
                )
            })}

        </Box>
    )
}