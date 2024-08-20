import Input from 'components/Input'
import Select from 'components/Select'
import { areaMaster, notifyTypeMaster } from 'domain/domain'
import { useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import { Config } from 'domain/schema'
import { postNHKAPI, postNotification, postPrograms } from 'logics/api'
import SaveButton from 'components/SaveButton'
import { DualInputFields } from 'components/DualInputFields'

export default function Settings() {
  const config = useLoaderData() as Config
  const [stateConfig, setConfig] = useState(config)
  const [selectedArea, setSelectedArea] = useState(stateConfig.area)
  const [NHKAPIKey, setNHKAPIKey] = useState(stateConfig.nhkAPIKey)

  const [selectedNotifyType, setNotifyType] = useState(stateConfig.selectNow)
  const [lineUserID, setLineUserID] = useState(config.LINEAPI.userID)
  const [lineAccessToken, setLineAccessToken] = useState(
    config.LINEAPI.accessToken
  )

  const [fields, setFields] = useState(config.programs)

  const addFields = () => {
    setFields([...fields, { title: '', keyword: '' }])
  }

  const handleRemoveField = (index: number) => {
    const newFields = fields.filter((_, i) => i !== index)
    setFields(newFields)
  }

  const handleInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newFields = fields.map((field, i) => {
      if (i === index) {
        return { ...field, [event.target.name]: event.target.value }
      }
      return field
    })
    setFields(newFields)
  }

  const validateMultiInput = () => {
    const containsEmpty = fields.some(
      (field) => field.title === '' || field.keyword === ''
    )
    const equalInitialPrograms =
      JSON.stringify(fields) === JSON.stringify(stateConfig.programs)
    return containsEmpty || equalInitialPrograms
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-md border border-gray-200/60 bg-gray-100/30 p-6">
        <header className="mb-4 flex justify-between gap-3">
          <hgroup>
            <h2 className="text-lg font-medium !leading-none text-black">
              Program
            </h2>
            <h3 className="mt-1 !leading-tight text-gray-500">
              Set programs to be notified
            </h3>
          </hgroup>
        </header>

        <div className="mt-3">
          {fields.map((field, index) => (
            <DualInputFields
              key={index}
              index={index}
              title={field.title}
              keyword={field.keyword}
              handleInputChange={handleInputChange}
              handleRemoveField={handleRemoveField}
            />
          ))}

          <div className="mt-3 flex gap-2">
            <button
              onClick={addFields}
              className="h-8 whitespace-nowrap rounded-md border border-gray-200 bg-gray-100 px-3.5 leading-none text-gray-900  transition-colors duration-150 ease-in-out hover:border-gray-300 hover:bg-gray-200"
            >
              Add Fields
            </button>
            <SaveButton
              isDisabled={validateMultiInput()}
              onClickLogic={() => {
                postPrograms(fields)
                const updatedConfig: Config = {
                  ...stateConfig,
                  programs: fields
                }
                setConfig(updatedConfig)
              }}
            />
          </div>
        </div>
      </div>

      <div className="rounded-md border border-gray-200/60 bg-gray-100/30 p-6">
        <header className="mb-4 flex justify-between gap-3">
          <hgroup>
            <h2 className="text-lg font-medium !leading-none text-black">
              NHK API
            </h2>
            <h3 className="mt-1 !leading-tight text-gray-500">
              Set broadcast area and API key
            </h3>
          </hgroup>
        </header>

        <Select
          value={selectedArea}
          options={areaMaster}
          setValue={setSelectedArea}
        />

        <Input
          placeholder="NHK API Key"
          showOnFocus={true}
          value={NHKAPIKey}
          setValue={setNHKAPIKey}
        />

        <div className="mt-3">
          <SaveButton
            isDisabled={
              (NHKAPIKey === '' || NHKAPIKey === stateConfig.nhkAPIKey) &&
              (selectedArea === '' || selectedArea === stateConfig.area)
            }
            onClickLogic={() => {
              postNHKAPI(selectedArea, NHKAPIKey)
              const updatedConfig = {
                ...stateConfig,
                area: selectedArea,
                nhkAPIKey: NHKAPIKey
              }

              setConfig(updatedConfig)
            }}
          />
        </div>
      </div>

      <div className="rounded-md border border-gray-200/60 bg-gray-100/30 p-6">
        <header className="mb-4 flex justify-between gap-3">
          <hgroup>
            <h2 className="text-lg font-medium !leading-none text-black">
              Notification
            </h2>
            <h3 className="mt-1 !leading-tight text-gray-500">
              Set notification type and configuration
            </h3>
          </hgroup>
        </header>

        <Select
          value={selectedNotifyType}
          options={notifyTypeMaster}
          setValue={setNotifyType}
        />

        <div className="mt-5">
          <header className="mb-4 flex justify-between gap-3">
            <hgroup>
              <h3 className="mt-1 font-medium !leading-tight text-black">
                LINE API
              </h3>
            </hgroup>
          </header>
          <Input
            placeholder="UserID"
            showOnFocus={false}
            value={lineUserID}
            setValue={setLineUserID}
          />
          <Input
            placeholder="AccessToken"
            showOnFocus={true}
            value={lineAccessToken}
            setValue={setLineAccessToken}
          />
        </div>

        <div className="mt-3">
          <SaveButton
            isDisabled={
              (lineUserID === '' ||
                lineUserID === stateConfig.LINEAPI.userID) &&
              (lineAccessToken === '' ||
                lineAccessToken === stateConfig.LINEAPI.accessToken)
            }
            onClickLogic={() => {
              postNotification(selectedNotifyType, lineUserID, lineAccessToken)
              const updatedConfig: Config = {
                ...stateConfig,
                LINEAPI: {
                  userID: lineUserID,
                  accessToken: lineAccessToken
                }
              }

              setConfig(updatedConfig)
            }}
          />
        </div>
      </div>
    </div>
  )
}
