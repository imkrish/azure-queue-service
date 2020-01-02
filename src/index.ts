import { QueueServiceClient } from '@azure/storage-queue'

// This connection string will be valid for 4 hours (For study purpose)
const CONNECTION_STRING =
  'DefaultEndpointsProtocol=https;AccountName=krishstoragequeue;AccountKey=9RX9JEMHeYFvwVcUvpp8FJ/n34jgFaevAKlqdZaFv3g2nhELOBFPVcVBRHP8rU8JhBNElf7DEbqGbVp3DVtVfQ==;EndpointSuffix=core.windows.net'

const QUEUE_NAME = 'myqueue'

async function main() {
  const queueServiceClient = QueueServiceClient.fromConnectionString(
    CONNECTION_STRING,
  )

  const queueClient = queueServiceClient.getQueueClient(QUEUE_NAME)
  const { clientRequestId } = await queueClient.create()
  console.log(`Created Queue ${clientRequestId}`)

  setInterval(async () => {
    const title = `My name is Kala ${Math.random()}`
    const { messageId } = await queueClient.sendMessage(
      JSON.stringify({ title }),
    )
    console.log(`Sent Message ${messageId}: ${title}`)
  }, 10000)

  setInterval(async () => {
    const { receivedMessageItems } = await queueClient.receiveMessages()
    if (receivedMessageItems.length === 1) {
      const message = receivedMessageItems[0]
      const { messageText, messageId, popReceipt } = message
      console.log(JSON.parse(messageText))
      await queueClient.deleteMessage(messageId, popReceipt)
      console.log('Deleted Message')
    } else {
      console.log('No message in the queue')
    }
  }, 5000)
}

main()
